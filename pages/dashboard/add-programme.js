import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Layout from './layout';
import dynamic from 'next/dynamic';
import slugify from 'slugify';

// Dynamically load the Jodit editor to prevent SSR issues
const JoditWrapper = dynamic(() => import('../../components/EditorWrapper'), { ssr: false });

export default function AddProgram() {
  const router = useRouter();
 // State for programs
 const [isEditing, setIsEditing] = useState(false);
  const [currentSlug, setCurrentSlug] = useState('');
 const [programs, setPrograms] = useState([]);
  // Separate states for each field
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [departmentInfo, setDepartmentInfo] = useState('');
  const [salientFeatures, setSalientFeatures] = useState('');
  const [curriculumStructure, setCurriculumStructure] = useState('');
  const [eligibilityRequirements, setEligibilityRequirements] = useState('');
  const [tuitionFees, setTuitionFees] = useState('');
  const [deanName, setDeanName] = useState('');
  const [deanMessage, setDeanMessage] = useState('');
  const [headName, setHeadName] = useState('');
  const [headMessage, setHeadMessage] = useState('');
  
  const [facultyMembers, setFacultyMembers] = useState([
    { name: '', designation: '', image: null, imageUrl: '' }
  ]);
  const [deanImage, setDeanImage] = useState(null); // for new image uploads
  const [deanImageUrl, setDeanImageUrl] = useState(''); // for existing image URL
  const [headImage, setHeadImage] = useState(null);
  const [headImageUrl, setHeadImageUrl] = useState('');
  
  // Automatically generate slug when the program name changes
  const handleProgramNameChange = (e) => {
    const nameValue = e.target.value;
    setName(nameValue);
    setSlug(slugify(nameValue, { lower: true }));
  };

  // Handle faculty members
  const handleFacultyChange = (index, e) => {
    const values = [...facultyMembers];
    values[index][e.target.name] = e.target.value;
    setFacultyMembers(values);
  };

  const handleAddFaculty = () => {
    setFacultyMembers([...facultyMembers, { name: '', designation: '', image: null }]);
  };

  const handleRemoveFaculty = (index) => {
    const values = [...facultyMembers];
    values.splice(index, 1);
    setFacultyMembers(values);
  };

  const handleFacultyFileChange = (index, file) => {
    const values = [...facultyMembers];
    values[index].image = file;
    setFacultyMembers(values);
  };

  const handleFileChange = (e, setFile) => {
    setFile(e.target.files[0]);
  };

   // Handle form submission (Add or Update)
   const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append('name', name);
    formData.append('slug', slug);
    formData.append('departmentInfo', departmentInfo);
    formData.append('salientFeatures', salientFeatures);
    formData.append('curriculumStructure', curriculumStructure);
    formData.append('eligibilityRequirements', eligibilityRequirements);
    formData.append('tuitionFees', tuitionFees);
    formData.append('deanName', deanName);
    formData.append('deanMessage', deanMessage);
    formData.append('headName', headName);
    formData.append('headMessage', headMessage);

  // Append new images if uploaded, otherwise keep the old URLs
  if (deanImage) {
    formData.append('deanImage', deanImage);
  } else {
    formData.append('deanImageUrl', deanImageUrl); // Send old image URL if no new image is uploaded
  }

  if (headImage) {
    formData.append('headImage', headImage);
  } else {
    formData.append('headImageUrl', headImageUrl); // Send old image URL if no new image is uploaded
  }
    

    facultyMembers.forEach((faculty, index) => {
      if (faculty.image) {
        formData.append(`facultyImages`, faculty.image);
      }
    });

    try {
      if (isEditing) {
        // Update program (PUT request)
        await axios.put(`/api/programme?slug=${currentSlug}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        // Add new program (POST request)
        await axios.post('/api/programme', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      // Reset form and state after submission
      setIsEditing(false);
      setName('');
      setSlug('');
      setDepartmentInfo('');
      setSalientFeatures('');
      setCurriculumStructure('');
      setEligibilityRequirements('');
      setTuitionFees('');
      setDeanName('');
      setDeanMessage('');
      setHeadName('');
      setHeadMessage('');
      setFacultyMembers([{ name: '', designation: '', image: null }]);
      setDeanImage(null);
      setHeadImage(null);

      router.push('/admin/programs');
    } catch (error) {
      console.error('Failed to submit:', error);
    }
  };

    // Fetch programs when component mounts
    useEffect(() => {
      const fetchPrograms = async () => {
        try {
          const response = await axios.get('/api/programme');
          setPrograms(response.data.data);
        } catch (error) {
          console.error('Failed to fetch programs:', error);
        }
      };
      
      fetchPrograms();
    }, []);
    const handleEdit = async (slug) => {
      setIsEditing(true);
      setCurrentSlug(slug);
      try {
        const response = await axios.get(`/api/programme?slug=${slug}`);
        const program = response.data.data;
    
        // Preload the form fields with the program's data
        setName(program.name);
        setSlug(program.slug);
        setDepartmentInfo(program.departmentInfo);
        setSalientFeatures(program.salientFeatures);
        setCurriculumStructure(program.curriculumStructure);
        setEligibilityRequirements(program.eligibilityRequirements);
        setTuitionFees(program.tuitionFees);
        setDeanName(program.deanName);
        setDeanMessage(program.deanMessage);
        setHeadName(program.headName);
        setHeadMessage(program.headMessage);
    // Set image URLs
    setDeanImageUrl(program.deanImage || ''); // Use existing deanImage if available
    setHeadImageUrl(program.headImage || ''); // Use existing headImage if available
        // Preload faculty members including image URLs
        const preloadedFacultyMembers = program.facultyMembers.map((faculty) => ({
          name: faculty.name,
          designation: faculty.designation,
          image: null, // New image can be uploaded later
          imageUrl: faculty.image || '', // Existing image URL
        }));
    
        setFacultyMembers(preloadedFacultyMembers);
      } catch (error) {
        console.error('Failed to load program data for editing:', error);
      }
    };
    



// Handle delete program
const handleDelete = async (slug) => {
  try {
    await axios.delete(`/api/programme?slug=${slug}`);
    setPrograms(programs.filter((program) => program.slug !== slug));
  } catch (error) {
    console.error('Failed to delete program:', error);
  }
};


  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Add New Program</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Program Name */}
          <div>
            <label className="block mb-2 font-semibold">Program Name</label>
            <input
              type="text"
              value={name}
              onChange={handleProgramNameChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          {/* Slug (Read-only Field) */}
          <div>
            <label className="block mb-2 font-semibold">Slug (Auto-Generated)</label>
            <input
              type="text"
              value={slug}
              className="w-full px-4 py-2 border rounded-lg bg-gray-100"
              readOnly
            />
          </div>

          {/* Department Info */}
          <div>
            <label className="block mb-2 font-semibold">Add About the Program</label>
            <JoditWrapper initialContent={departmentInfo} onChange={setDepartmentInfo} />
          </div>

          {/* Salient Features */}
          <div className='mb-3 border rounded p-5'>
            <label className="block mb-2 font-semibold">Add Salient Features</label>
            <JoditWrapper
              initialContent={salientFeatures}
             onChange={setSalientFeatures}
            />
          </div>

          {/* Curriculum Structure */}
          <div className='mb-3 border rounded p-5'>
            <label className="block mb-2 font-semibold">Add Curriculum Structure</label>
            <JoditWrapper
              initialContent={curriculumStructure}
             onChange={setCurriculumStructure}
            />
          </div>

          {/* Eligibility Requirements */}
          <div className='mb-3 border rounded p-5'>
            <label className="block mb-2 font-semibold">Add Eligibility Requirements</label>
            <JoditWrapper
              initialContent={eligibilityRequirements}
             onChange={setEligibilityRequirements}
            />
          </div>

          {/* Tuition Fees */}
          <div className='mb-3 border rounded p-5'>
            <label className="block mb-2 font-semibold">Add Tuition Fees</label>
            <JoditWrapper
              initialContent={tuitionFees}
              onChange={setTuitionFees}
            />
          </div>

          {/* Faculty Members */}
          <div>
  <label className="block mb-4 font-semibold">Add Faculty Members</label>
  {facultyMembers.map((member, index) => (
    <div key={index} className="space-y-4 border p-5 rounded-lg mb-4">
      <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
        <input
          type="text"
          name="name"
          value={member.name}
          onChange={(e) => handleFacultyChange(index, e)}
          placeholder="Member Name"
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
        <input
          type="text"
          name="designation"
          value={member.designation}
          onChange={(e) => handleFacultyChange(index, e)}
          placeholder="Designation"
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
      </div>

      {/* Display image preview if it exists */}
      {member.imageUrl && (
        <div className="mb-2">
          <img src={member.imageUrl} alt="Faculty Image" className="w-32 h-32 object-cover" />
        </div>
      )}

      <input
        type="file"
        onChange={(e) => handleFacultyFileChange(index, e.target.files[0])}
        className="w-full md:w-auto"
      />
      <button
        type="button"
        onClick={() => handleRemoveFaculty(index)}
        className="text-red-600"
      >
        Remove
      </button>
    </div>
  ))}
  <button type="button" onClick={handleAddFaculty} className="mt-4 text-blue-600">
    Add Another Faculty Member
  </button>
</div>

          {/* Dean Info */}
          <div className='mb-3 border rounded p-5'>
            <label className="block mb-2 font-semibold">Dean's Image</label>
            <input
              type="file"
              onChange={(e) => handleFileChange(e, setDeanImage)}
              className="w-full"
              required
            />
            {deanImageUrl && (
    <div className="mb-2">
      <img src={deanImageUrl} alt="Head's Image" className="w-32 h-32 object-cover" />
    </div>
  )}
            <label className="block mb-2 font-semibold">Dean's Name</label>
            <input
              type="text"
              value={deanName}
              onChange={(e) => setDeanName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
            <label className="block mb-2 font-semibold">Dean's Message</label>
            <textarea
              value={deanMessage}
              onChange={(e) => setDeanMessage(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          {/* Head Info */}
          <div className='mb-3 border rounded p-5'>
            <label className="block mb-2 font-semibold">Head's Image</label>
            <input
              type="file"
              onChange={(e) => handleFileChange(e, setHeadImage)}
              className="w-full"
              required
            />
            {headImageUrl && (
    <div className="mb-2">
      <img src={headImageUrl} alt="Dean's Image" className="w-32 h-32 object-cover" />
    </div>
  )}
            <label className="block mb-2 font-semibold">Head's Name</label>
            <input
              type="text"
              value={headName}
              onChange={(e) => setHeadName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
            <label className="block mb-2 font-semibold">Head's Message</label>
            <textarea
              value={headMessage}
              onChange={(e) => setHeadMessage(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          <button type="submit" className="w-32 py-2 bg-blue-600 text-white rounded-lg">
            {isEditing ? 'Update Program' : 'Add Program'}
          </button>
        </form>
        {/* Table for showing existing programs */}
        <h2 className="text-2xl font-bold mt-10">Existing Programs</h2>
        <table className="table-auto w-full mt-4 border">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Program Name</th>
              <th className="px-4 py-2">Edit</th>
              <th className="px-4 py-2">Delete</th>
            </tr>
          </thead>
          <tbody>
            {programs.map((program) => (
              <tr key={program._id}>
                <td className="border px-4 py-2">{program.name}</td>
                <td className="border px-4 py-2">
                  <button
                    className="text-blue-600"
                    onClick={() => handleEdit(program.slug)}
                  >
                    Edit
                  </button>
                </td>
                <td className="border px-4 py-2">
                  <button
                    className="text-red-600"
                    onClick={() => handleDelete(program.slug)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
    </Layout>
  );
}
