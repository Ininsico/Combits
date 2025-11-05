// ProfileSection.jsx
import React, { useState, useEffect } from 'react';

// Database simulation for profile data and memories
const createDatabase = () => {
  // In a real application, this would connect to an actual database
  return {
    profiles: {
      'default': {
        id: 'default',
        username: 'artbyzefa',
        displayName: 'zefa',
        bio: 'Ranjish he sahi "Dil he Dukhane ke liay Aaah"',
        website: 'www.artbyzefa.today',
        localHost: '127.0.0.1',
        socialHandle: '@_huzaifa0900',
        profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        coverImage: 'https://images.unsplash.com/photo-1579546929662-711aa81148cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        notesCount: 12,
        pdfCount: 5,
        otherCount: 8,
        joinDate: '2023-01-15',
        lastActive: '2025-11-05T12:04:53Z'
      }
    },
    memories: {
      'default': [
        {
          id: 'memory-1',
          title: 'Project Documentation',
          type: 'PDF',
          description: 'Complete project documentation with specifications and requirements',
          fileUrl: '#',
          uploadDate: '2025-10-28',
          tags: ['documentation', 'project', 'specs'],
          size: '2.4 MB',
          favorite: true
        },
        {
          id: 'memory-2',
          title: 'Meeting Notes - Client Review',
          type: 'Note',
          description: 'Detailed notes from the client review meeting with action items',
          fileUrl: '#',
          uploadDate: '2025-10-25',
          tags: ['meeting', 'client', 'action-items'],
          size: '156 KB',
          favorite: false
        },
        {
          id: 'memory-3',
          title: 'Design Inspiration Collection',
          type: 'Other',
          description: 'Curated collection of design references and inspiration',
          fileUrl: '#',
          uploadDate: '2025-10-20',
          tags: ['design', 'inspiration', 'references'],
          size: '15.7 MB',
          favorite: true
        },
        {
          id: 'memory-4',
          title: 'Technical Specifications',
          type: 'PDF',
          description: 'Detailed technical specifications for the upcoming project',
          fileUrl: '#',
          uploadDate: '2025-10-18',
          tags: ['technical', 'specs', 'development'],
          size: '3.1 MB',
          favorite: false
        },
        {
          id: 'memory-5',
          title: 'Brainstorming Session',
          type: 'Note',
          description: 'Ideas and concepts from the team brainstorming session',
          fileUrl: '#',
          uploadDate: '2025-10-15',
          tags: ['brainstorming', 'ideas', 'concepts'],
          size: '89 KB',
          favorite: true
        },
        {
          id: 'memory-6',
          title: 'Resource Library',
          type: 'Other',
          description: 'Collection of useful resources and tools for the project',
          fileUrl: '#',
          uploadDate: '2025-10-10',
          tags: ['resources', 'tools', 'library'],
          size: '8.2 MB',
          favorite: false
        }
      ]
    },
    settings: {
      theme: 'dark',
      layout: 'grid',
      itemsPerPage: 6,
      sortBy: 'date',
      sortOrder: 'desc'
    }
  };
};

// Database operations
const database = createDatabase();

// Utility functions
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getMemoryTypeColor = (type) => {
  switch (type) {
    case 'PDF':
      return 'bg-red-500';
    case 'Note':
      return 'bg-blue-500';
    case 'Other':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

const getMemoryTypeIcon = (type) => {
  switch (type) {
    case 'PDF':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
      );
    case 'Note':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
      );
    case 'Other':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
        </svg>
      );
    default:
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
        </svg>
      );
  }
};

// Main Profile Section Component
const ProfileSection = () => {
  const [profile, setProfile] = useState(null);
  const [memories, setMemories] = useState([]);
  const [filteredMemories, setFilteredMemories] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [layout, setLayout] = useState(database.settings.layout);
  const [sortBy, setSortBy] = useState(database.settings.sortBy);
  const [sortOrder, setSortOrder] = useState(database.settings.sortOrder);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(database.settings.itemsPerPage);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);

  // Load profile and memories on component mount
  useEffect(() => {
    const loadProfileData = () => {
      setProfile(database.profiles.default);
      setMemories(database.memories.default);
      setFilteredMemories(database.memories.default);
      
      // Extract all unique tags from memories
      const tags = [...new Set(database.memories.default.flatMap(memory => memory.tags))];
      setAvailableTags(tags);
      
      // Initialize edit form with current profile data
      setEditForm({ ...database.profiles.default });
    };

    loadProfileData();
  }, []);

  // Filter and sort memories when filters, sort options, or search query change
  useEffect(() => {
    let filtered = [...memories];
    
    // Apply type filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(memory => memory.type === activeFilter);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(memory => 
        memory.title.toLowerCase().includes(query) || 
        memory.description.toLowerCase().includes(query) ||
        memory.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Apply tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(memory => 
        selectedTags.some(tag => memory.tags.includes(tag))
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'date':
          aValue = new Date(a.uploadDate);
          bValue = new Date(b.uploadDate);
          break;
        case 'size':
          aValue = parseFloat(a.size);
          bValue = parseFloat(b.size);
          break;
        default:
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    setFilteredMemories(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [memories, activeFilter, sortBy, sortOrder, searchQuery, selectedTags]);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMemories = filteredMemories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMemories.length / itemsPerPage);

  // Handle filter change
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  // Handle layout change
  const handleLayoutChange = (newLayout) => {
    setLayout(newLayout);
  };

  // Handle sort change
  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle edit profile
  const handleEditProfile = () => {
    setIsEditing(true);
  };

  // Handle save profile
  const handleSaveProfile = () => {
    // In a real application, this would update the database
    setProfile(editForm);
    setIsEditing(false);
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditForm({ ...profile });
    setIsEditing(false);
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsUploading(true);
    
    // Simulate file upload
    setTimeout(() => {
      const newMemory = {
        id: `memory-${Date.now()}`,
        title: file.name,
        type: file.type.includes('pdf') ? 'PDF' : file.type.includes('text') ? 'Note' : 'Other',
        description: `Uploaded ${file.name}`,
        fileUrl: '#',
        uploadDate: new Date().toISOString().split('T')[0],
        tags: ['uploaded'],
        size: formatFileSize(file.size),
        favorite: false
      };
      
      setMemories(prev => [newMemory, ...prev]);
      setIsUploading(false);
      
      // Reset file input
      e.target.value = '';
    }, 1500);
  };

  // Handle memory favorite toggle
  const handleFavoriteToggle = (memoryId) => {
    setMemories(prev => 
      prev.map(memory => 
        memory.id === memoryId 
          ? { ...memory, favorite: !memory.favorite } 
          : memory
      )
    );
  };

  // Handle tag selection
  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  // Clear all filters
  const handleClearFilters = () => {
    setActiveFilter('all');
    setSearchQuery('');
    setSelectedTags([]);
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      {/* Cover Photo */}
      <div className="relative h-64 bg-gradient-to-r from-purple-900 to-blue-900">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${profile.coverImage})` }}
        ></div>
        <div className="absolute bottom-4 right-4">
          <button className="bg-gray-800 bg-opacity-70 hover:bg-opacity-100 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Change Cover
          </button>
        </div>
      </div>

      {/* Profile Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
          <div className="md:flex">
            {/* Profile Picture and Basic Info */}
            <div className="md:w-1/3 p-8 border-r border-gray-700">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <img 
                    src={profile.profileImage} 
                    alt={profile.displayName}
                    className="w-40 h-40 rounded-full border-4 border-gray-800 object-cover shadow-lg"
                  />
                  <button className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-colors duration-200">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
                
                {isEditing ? (
                  <div className="mt-6 w-full">
                    <input
                      type="text"
                      name="displayName"
                      value={editForm.displayName}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      name="username"
                      value={editForm.username}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <textarea
                      name="bio"
                      value={editForm.bio}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      name="website"
                      value={editForm.website}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex space-x-2">
                      <button 
                        onClick={handleSaveProfile}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                      >
                        Save
                      </button>
                      <button 
                        onClick={handleCancelEdit}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 className="mt-6 text-2xl font-bold">{profile.displayName}</h1>
                    <p className="text-gray-400 mt-1">@{profile.username}</p>
                    <p className="mt-4 text-center text-gray-300">{profile.bio}</p>
                    <div className="mt-4 flex items-center text-sm text-gray-400">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <a href={`http://${profile.website}`} className="hover:text-blue-400 transition-colors duration-200">
                        {profile.website}
                      </a>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-400">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                      </svg>
                      <span>Local Host: {profile.localHost}</span>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-400">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>{profile.socialHandle}</span>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-3 gap-4 w-full">
                      <div className="bg-gray-700 rounded-lg p-4 text-center">
                        <div className="text-xl font-bold">{profile.notesCount}</div>
                        <div className="text-xs text-gray-400 mt-1">Notes</div>
                      </div>
                      <div className="bg-gray-700 rounded-lg p-4 text-center">
                        <div className="text-xl font-bold">{profile.pdfCount}</div>
                        <div className="text-xs text-gray-400 mt-1">PDFs</div>
                      </div>
                      <div className="bg-gray-700 rounded-lg p-4 text-center">
                        <div className="text-xl font-bold">{profile.otherCount}</div>
                        <div className="text-xs text-gray-400 mt-1">Other</div>
                      </div>
                    </div>
                    
                    <div className="mt-6 w-full">
                      <button 
                        onClick={handleEditProfile}
                        className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Profile
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Memories Section */}
            <div className="md:w-2/3 p-8">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Memories & Archives</h2>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleLayoutChange('grid')}
                      className={`p-2 rounded-lg ${layout === 'grid' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'} transition-colors duration-200`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleLayoutChange('list')}
                      className={`p-2 rounded-lg ${layout === 'list' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'} transition-colors duration-200`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Filters and Search */}
                <div className="mb-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                    <div className="flex flex-wrap gap-2">
                      <button 
                        onClick={() => handleFilterChange('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${activeFilter === 'all' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                      >
                        All
                      </button>
                      <button 
                        onClick={() => handleFilterChange('PDF')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${activeFilter === 'PDF' ? 'bg-red-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                      >
                        PDFs
                      </button>
                      <button 
                        onClick={() => handleFilterChange('Note')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${activeFilter === 'Note' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                      >
                        Notes
                      </button>
                      <button 
                        onClick={() => handleFilterChange('Other')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${activeFilter === 'Other' ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                      >
                        Other
                      </button>
                      
                      {selectedTags.length > 0 && (
                        <button 
                          onClick={handleClearFilters}
                          className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-600 hover:bg-gray-500 transition-colors duration-200"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search memories..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
                        />
                        <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      
                      <div className="relative">
                        <select
                          value={`${sortBy}-${sortOrder}`}
                          onChange={(e) => {
                            const [newSortBy, newSortOrder] = e.target.value.split('-');
                            setSortBy(newSortBy);
                            setSortOrder(newSortOrder);
                          }}
                          className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8"
                        >
                          <option value="date-desc">Newest First</option>
                          <option value="date-asc">Oldest First</option>
                          <option value="title-asc">Title A-Z</option>
                          <option value="title-desc">Title Z-A</option>
                          <option value="size-desc">Largest First</option>
                          <option value="size-asc">Smallest First</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Tag Filters */}
                  {availableTags.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-400 mb-2">Filter by Tags:</h3>
                      <div className="flex flex-wrap gap-2">
                        {availableTags.map(tag => (
                          <button
                            key={tag}
                            onClick={() => handleTagToggle(tag)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${selectedTags.includes(tag) ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Upload Area */}
                <div className="mb-6">
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-gray-500 transition-colors duration-200">
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      {isUploading ? (
                        <div className="flex flex-col items-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
                          <p className="text-gray-400">Uploading...</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="text-gray-400">Drag and drop files here or click to upload</p>
                          <p className="text-xs text-gray-500 mt-1">Supports PDF, text files, and other documents</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
                
                {/* Memories Grid/List */}
                {filteredMemories.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-500 py-12">
                    <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-lg">No memories found</p>
                    <p className="text-sm mt-2">Try changing your filters or upload a new file</p>
                  </div>
                ) : (
                  <>
                    <div className={`${layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'} flex-1 overflow-auto`}>
                      {currentMemories.map(memory => (
                        <div 
                          key={memory.id}
                          className={`bg-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200 ${layout === 'list' ? 'flex' : ''}`}
                        >
                          <div className={`${getMemoryTypeColor(memory.type)} p-4 flex items-center justify-center ${layout === 'list' ? 'w-20' : 'h-32'}`}>
                            {getMemoryTypeIcon(memory.type)}
                          </div>
                          <div className={`p-4 ${layout === 'list' ? 'flex-1' : ''}`}>
                            <div className="flex justify-between items-start">
                              <h3 className="font-bold text-lg truncate">{memory.title}</h3>
                              <button 
                                onClick={() => handleFavoriteToggle(memory.id)}
                                className="text-gray-400 hover:text-yellow-400 transition-colors duration-200 ml-2"
                              >
                                {memory.favorite ? (
                                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ) : (
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                  </svg>
                                )}
                              </button>
                            </div>
                            <p className="text-gray-400 text-sm mt-1 line-clamp-2">{memory.description}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {memory.tags.map(tag => (
                                <span 
                                  key={tag} 
                                  className="px-2 py-1 bg-gray-600 rounded-full text-xs text-gray-300"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
                              <span>{formatDate(memory.uploadDate)}</span>
                              <span>{memory.size}</span>
                            </div>
                            <div className="flex space-x-2 mt-4">
                              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm transition-colors duration-200">
                                View
                              </button>
                              <button className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-lg text-sm transition-colors duration-200">
                                Download
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="mt-8 flex justify-center">
                        <nav className="flex items-center space-x-2">
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`p-2 rounded-lg ${currentPage === 1 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`px-3 py-2 rounded-lg ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
                            >
                              {page}
                            </button>
                          ))}
                          
                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`p-2 rounded-lg ${currentPage === totalPages ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </nav>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Profile Stats Footer */}
        <div className="mt-8 bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">Profile Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-400">Total Memories</div>
              <div className="text-2xl font-bold mt-1">{memories.length}</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-400">Favorites</div>
              <div className="text-2xl font-bold mt-1">{memories.filter(m => m.favorite).length}</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-400">Member Since</div>
              <div className="text-lg font-bold mt-1">{formatDate(profile.joinDate)}</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-400">Last Active</div>
              <div className="text-lg font-bold mt-1">{formatDate(profile.lastActive)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;