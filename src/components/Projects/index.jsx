import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css';
import { toast } from 'react-toastify';
import { baseUrl } from '../../config';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [projectsCount, setProjectsCount] = useState(0);

    const [value, setValue] = useState('');

    const handleAdd = async () => {
        let inpValue = value.trim();
        if (inpValue.length < 3) {
            toast.error('Enter at least 3 characters')
            return;
        }

        try {
            const response = await axios.post(`${baseUrl}/projects`, { name: inpValue });
            if (response) {
                toast.success("Project Added successfully")
                fetchProjects();
                fetchProjectCount();
            }
            setValue('');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong')
        }
    };


    const fetchProjects = async () => {
        try {
            const response = await axios.get(`${baseUrl}/projects`);
            setProjects(response.data.projects);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong')
        }
    };


    const fetchProjectCount = async () => {
        try {
            const response = await axios.get(`${baseUrl}/projects/count`);
            console.log("response ", response);
            setProjectsCount(response.data.count);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong')
        }
    };

    const handleEdit = (index) => {
        setProjects(projects.map((project, i) => (
            i === index ? { ...project, isEditing: true } : project
        )));
    };

    const handleEditSave = async (index, newName) => {
        const project = projects[index];
        try {
            let res = await axios.put(`${baseUrl}/projects/${project.id}`, { name: newName });
            if (res) {
                toast.success("Project Updated successfully")
                fetchProjects();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong')
        }
    };

    const handleDelete = async (id) => {
        try {
            let res = await axios.delete(`${baseUrl}/projects/${id}`);
            console.log("res", res);
            if (res?.data?.deletedProject) {
                toast.success(`Project ${res?.data?.deletedProject?.name} is deleted successfully`)
                fetchProjects();
                fetchProjectCount();
            }
            setProjects(projects.filter(project => project.id !== id));
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong')
        }
    };



    useEffect(() => {
        fetchProjects();
        fetchProjectCount()
    }, []);



    return (
        <>
            <div className='formMain'>
                <h3>Add New Project</h3>
                <label htmlFor="projName">Name</label>
                <input
                    type="text"
                    value={value}
                    id='projName'
                    onChange={(e) => setValue(e.target.value)}
                    placeholder='Enter project name'
                />
                <div className='btnMainDiv'>
                    <button type='button' onClick={handleAdd}>Save</button>
                </div>
            </div>
            <div className='ProjectsMain'>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h3>Project List ({projectsCount})</h3>
                    <button type='button' onClick={() => fetchProjects()}>Refresh</button>
                </div>
                <ul>
                    {projects.map((project, index) => (
                        <li key={project.id}>
                            <p>{project.id}</p>
                            <div>
                                <input
                                    type='text'
                                    value={project.name}
                                    onChange={(e) => setProjects(projects.map((proj, i) => (
                                        i === index ? { ...proj, name: e.target.value } : proj
                                    )))}
                                    className={project.isEditing ? 'editingInp' : ''}
                                    disabled={!project.isEditing}
                                />
                            </div>
                            <div className='btnMainDiv'>
                                {project.isEditing ? (
                                    <button type='button' onClick={() => handleEditSave(index, project.name)}>Save</button>
                                ) : (
                                    <button type='button' onClick={() => handleEdit(index)}>Edit</button>
                                )}
                                <button type='button' onClick={() => handleDelete(project.id)} style={{ backgroundColor: 'red', borderColor: 'red' }}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default Projects;
