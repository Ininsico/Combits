import React, { useState, useEffect, useRef } from 'react';

const StudyGroupSession = () => {
  // State management
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [groupMembers, setGroupMembers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [activeTab, setActiveTab] = useState('chat');
  const [isOnline, setIsOnline] = useState(true);
  const fileInputRef = useRef(null);
  const pdfInputRef = useRef(null);
  const imageInputRef = useRef(null);

  // Initialize with dummy data
  useEffect(() => {
    // Dummy group members
    const dummyMembers = [
      { id: 1, name: 'Alex Johnson', avatar: 'AJ', status: 'online', role: 'Organizer' },
      { id: 2, name: 'Sarah Miller', avatar: 'SM', status: 'online', role: 'Member' },
      { id: 3, name: 'Mike Chen', avatar: 'MC', status: 'online', role: 'Member' },
      { id: 4, name: 'Emma Davis', avatar: 'ED', status: 'away', role: 'Member' },
      { id: 5, name: 'James Wilson', avatar: 'JW', status: 'offline', role: 'Member' },
      { id: 6, name: 'Lisa Brown', avatar: 'LB', status: 'online', role: 'Member' },
      { id: 7, name: 'Ryan Taylor', avatar: 'RT', status: 'online', role: 'Member' },
      { id: 8, name: 'Priya Patel', avatar: 'PP', status: 'away', role: 'Member' },
      { id: 9, name: 'David Kim', avatar: 'DK', status: 'online', role: 'Member' },
      { id: 10, name: 'Maya Rodriguez', avatar: 'MR', status: 'offline', role: 'Member' }
    ];

    // Dummy messages (tweets)
    const dummyMessages = [
      {
        id: 1,
        userId: 1,
        userName: 'Alex Johnson',
        userAvatar: 'AJ',
        content: 'Hey everyone! Welcome to our Calculus study session. Let\'s start with limits and derivatives.',
        timestamp: new Date(Date.now() - 3600000),
        likes: 5,
        replies: [
          {
            id: 101,
            userId: 2,
            userName: 'Sarah Miller',
            userAvatar: 'SM',
            content: 'Great! I have some practice problems we can work on.',
            timestamp: new Date(Date.now() - 3500000),
            likes: 2
          }
        ],
        fileAttachments: []
      },
      {
        id: 2,
        userId: 3,
        userName: 'Mike Chen',
        userAvatar: 'MC',
        content: 'Does anyone have good resources for understanding the chain rule? I\'m struggling with it.',
        timestamp: new Date(Date.now() - 3000000),
        likes: 3,
        replies: [],
        fileAttachments: []
      },
      {
        id: 3,
        userId: 6,
        userName: 'Lisa Brown',
        userAvatar: 'LB',
        content: 'I found this amazing YouTube playlist that explains everything step by step!',
        timestamp: new Date(Date.now() - 2400000),
        likes: 7,
        replies: [
          {
            id: 102,
            userId: 3,
            userName: 'Mike Chen',
            userAvatar: 'MC',
            content: 'Thanks Lisa! This looks super helpful.',
            timestamp: new Date(Date.now() - 2300000),
            likes: 1
          },
          {
            id: 103,
            userId: 1,
            userName: 'Alex Johnson',
            userAvatar: 'AJ',
            content: 'Perfect timing! We can go through this together.',
            timestamp: new Date(Date.now() - 2200000),
            likes: 2
          }
        ],
        fileAttachments: []
      }
    ];

    // Dummy uploaded files
    const dummyFiles = [
      {
        id: 1,
        name: 'Calculus_Notes.pdf',
        type: 'pdf',
        uploadedBy: 'Alex Johnson',
        timestamp: new Date(Date.now() - 2800000),
        size: '2.4 MB',
        url: '#'
      },
      {
        id: 2,
        name: 'Derivatives_Chart.png',
        type: 'image',
        uploadedBy: 'Sarah Miller',
        timestamp: new Date(Date.now() - 2600000),
        size: '1.2 MB',
        url: '#'
      },
      {
        id: 3,
        name: 'Practice_Problems.docx',
        type: 'document',
        uploadedBy: 'Mike Chen',
        timestamp: new Date(Date.now() - 2000000),
        size: '0.8 MB',
        url: '#'
      }
    ];

    setGroupMembers(dummyMembers);
    setMessages(dummyMessages);
    setUploadedFiles(dummyFiles);
    setOnlineUsers(dummyMembers.filter(member => member.status === 'online'));
  }, []);

  // Handle sending new message
  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const newMessageObj = {
      id: messages.length + 1,
      userId: 1, // Current user ID
      userName: 'You',
      userAvatar: 'ME',
      content: newMessage,
      timestamp: new Date(),
      likes: 0,
      replies: [],
      fileAttachments: []
    };

    setMessages([newMessageObj, ...messages]);
    setNewMessage('');
  };

  // Handle replying to a message
  const handleReply = (messageId) => {
    if (replyText.trim() === '') return;

    const newReply = {
      id: Date.now(),
      userId: 1,
      userName: 'You',
      userAvatar: 'ME',
      content: replyText,
      timestamp: new Date(),
      likes: 0
    };

    const updatedMessages = messages.map(msg => {
      if (msg.id === messageId) {
        return {
          ...msg,
          replies: [...msg.replies, newReply]
        };
      }
      return msg;
    });

    setMessages(updatedMessages);
    setReplyText('');
    setReplyingTo(null);
  };

  // Handle file upload
  const handleFileUpload = (event, fileType) => {
    const files = Array.from(event.target.files);
    
    const newFiles = files.map(file => ({
      id: uploadedFiles.length + 1,
      name: file.name,
      type: fileType,
      uploadedBy: 'You',
      timestamp: new Date(),
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      url: URL.createObjectURL(file)
    }));

    setUploadedFiles([...newFiles, ...uploadedFiles]);
    
    // Create a message for the file upload
    const uploadMessage = {
      id: messages.length + 1,
      userId: 1,
      userName: 'You',
      userAvatar: 'ME',
      content: `Uploaded ${files.length} ${fileType} file(s)`,
      timestamp: new Date(),
      likes: 0,
      replies: [],
      fileAttachments: newFiles
    };

    setMessages([uploadMessage, ...messages]);
  };

  // Handle like
  const handleLike = (messageId, isReply = false, parentId = null) => {
    if (isReply && parentId) {
      const updatedMessages = messages.map(msg => {
        if (msg.id === parentId) {
          const updatedReplies = msg.replies.map(reply => {
            if (reply.id === messageId) {
              return { ...reply, likes: reply.likes + 1 };
            }
            return reply;
          });
          return { ...msg, replies: updatedReplies };
        }
        return msg;
      });
      setMessages(updatedMessages);
    } else {
      const updatedMessages = messages.map(msg => {
        if (msg.id === messageId) {
          return { ...msg, likes: msg.likes + 1 };
        }
        return msg;
      });
      setMessages(updatedMessages);
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  // Get file icon
  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'pdf': return '📄';
      case 'image': return '🖼️';
      case 'document': return '📝';
      default: return '📎';
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 p-4 border-b border-gray-700">
        <div>
          <h1 className="text-2xl font-bold">Calculus Study Group</h1>
          <p className="text-gray-400">Session Active • {onlineUsers.length}/10 Members Online</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-500'}`}></div>
            <span className="text-sm">{isOnline ? 'Online' : 'Offline'}</span>
          </div>
          <button 
            onClick={() => setIsOnline(!isOnline)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            {isOnline ? 'Go Offline' : 'Go Online'}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar - Members */}
        <div className="lg:w-1/4 bg-gray-800 rounded-lg p-4 h-fit">
          <h2 className="text-lg font-semibold mb-4">Group Members</h2>
          <div className="space-y-3">
            {groupMembers.map(member => (
              <div key={member.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-semibold">
                      {member.avatar}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-800 ${getStatusColor(member.status)}`}></div>
                  </div>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-xs text-gray-400">{member.role}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400 capitalize">{member.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:w-2/4">
          {/* Navigation Tabs */}
          <div className="flex space-x-4 mb-6 border-b border-gray-700">
            {['chat', 'files', 'whiteboard'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-medium capitalize ${
                  activeTab === tab 
                    ? 'border-b-2 border-blue-500 text-blue-500' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab === 'chat' ? 'Study Chat' : tab}
              </button>
            ))}
          </div>

          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <div className="space-y-4">
              {/* Compose Message */}
              <div className="bg-gray-800 rounded-lg p-4">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Share your study thoughts, questions, or resources..."
                  className="w-full bg-gray-700 rounded-lg p-3 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
                <div className="flex justify-between items-center mt-3">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => imageInputRef.current?.click()}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                      title="Upload Image"
                    >
                      🖼️
                    </button>
                    <button 
                      onClick={() => pdfInputRef.current?.click()}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                      title="Upload PDF"
                    >
                      📄
                    </button>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                      title="Upload Document"
                    >
                      📎
                    </button>
                  </div>
                  <button
                    onClick={handleSendMessage}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
                  >
                    Post
                  </button>
                </div>

                {/* Hidden file inputs */}
                <input
                  type="file"
                  ref={imageInputRef}
                  onChange={(e) => handleFileUpload(e, 'image')}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
                <input
                  type="file"
                  ref={pdfInputRef}
                  onChange={(e) => handleFileUpload(e, 'pdf')}
                  accept=".pdf"
                  multiple
                  className="hidden"
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => handleFileUpload(e, 'document')}
                  accept=".doc,.docx,.txt"
                  multiple
                  className="hidden"
                />
              </div>

              {/* Messages Feed */}
              <div className="space-y-4">
                {messages.map(message => (
                  <div key={message.id} className="bg-gray-800 rounded-lg p-4">
                    {/* Main Message */}
                    <div className="flex space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                        {message.userAvatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-semibold">{message.userName}</span>
                          <span className="text-gray-400 text-sm">{formatTime(message.timestamp)}</span>
                        </div>
                        <p className="text-gray-100 mb-2 whitespace-pre-wrap">{message.content}</p>
                        
                        {/* File Attachments */}
                        {message.fileAttachments && message.fileAttachments.length > 0 && (
                          <div className="space-y-2 mb-3">
                            {message.fileAttachments.map(file => (
                              <div key={file.id} className="flex items-center space-x-2 p-2 bg-gray-700 rounded">
                                <span className="text-lg">{getFileIcon(file.type)}</span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">{file.name}</p>
                                  <p className="text-xs text-gray-400">{file.size}</p>
                                </div>
                                <a 
                                  href={file.url} 
                                  download
                                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
                                >
                                  Download
                                </a>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Message Actions */}
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <button 
                            onClick={() => handleLike(message.id)}
                            className="flex items-center space-x-1 hover:text-red-500 transition-colors"
                          >
                            <span>❤️</span>
                            <span>{message.likes}</span>
                          </button>
                          <button 
                            onClick={() => setReplyingTo(replyingTo === message.id ? null : message.id)}
                            className="flex items-center space-x-1 hover:text-blue-500 transition-colors"
                          >
                            <span>💬</span>
                            <span>{message.replies.length}</span>
                          </button>
                          <button className="flex items-center space-x-1 hover:text-green-500 transition-colors">
                            <span>🔄</span>
                            <span>Share</span>
                          </button>
                        </div>

                        {/* Reply Input */}
                        {replyingTo === message.id && (
                          <div className="mt-3 pl-4 border-l-2 border-blue-500">
                            <textarea
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Type your reply..."
                              className="w-full bg-gray-700 rounded-lg p-3 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                              rows="2"
                            />
                            <div className="flex justify-end space-x-2 mt-2">
                              <button
                                onClick={() => setReplyingTo(null)}
                                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleReply(message.id)}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                              >
                                Reply
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Replies */}
                    {message.replies.length > 0 && (
                      <div className="mt-4 space-y-3 pl-14">
                        {message.replies.map(reply => (
                          <div key={reply.id} className="flex space-x-3">
                            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0">
                              {reply.userAvatar}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-semibold text-sm">{reply.userName}</span>
                                <span className="text-gray-400 text-xs">{formatTime(reply.timestamp)}</span>
                              </div>
                              <p className="text-gray-100 text-sm mb-1 whitespace-pre-wrap">{reply.content}</p>
                              <div className="flex items-center space-x-3 text-xs text-gray-400">
                                <button 
                                  onClick={() => handleLike(reply.id, true, message.id)}
                                  className="flex items-center space-x-1 hover:text-red-500 transition-colors"
                                >
                                  <span>❤️</span>
                                  <span>{reply.likes}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Files Tab */}
          {activeTab === 'files' && (
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Shared Files</h2>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => imageInputRef.current?.click()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    Upload File
                  </button>
                </div>
              </div>

              <div className="grid gap-4">
                {uploadedFiles.map(file => (
                  <div key={file.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">
                        {getFileIcon(file.type)}
                      </div>
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-gray-400">
                          Uploaded by {file.uploadedBy} • {formatTime(file.timestamp)} • {file.size}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <a 
                        href={file.url} 
                        download
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                      >
                        Download
                      </a>
                      <button className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors">
                        Share
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {uploadedFiles.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-6xl mb-4">📁</div>
                  <p className="text-lg">No files shared yet</p>
                  <p className="text-sm">Upload your first study material to get started</p>
                </div>
              )}
            </div>
          )}

          {/* Whiteboard Tab */}
          {activeTab === 'whiteboard' && (
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Collaborative Whiteboard</h2>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                    Clear Board
                  </button>
                  <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors">
                    Save Snapshot
                  </button>
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-4 min-h-[400px] flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="text-6xl mb-4">🎨</div>
                  <p className="text-lg mb-2">Collaborative Whiteboard</p>
                  <p className="text-sm">Draw, write equations, and collaborate in real-time</p>
                  <button className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors">
                    Start Drawing
                  </button>
                </div>
              </div>

              <div className="mt-4 flex space-x-2 overflow-x-auto">
                {['✏️', '🖌️', '📐', '🧮', '📝', '🎯'].map((tool, index) => (
                  <button
                    key={index}
                    className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-xl transition-colors flex-shrink-0"
                  >
                    {tool}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Online Users & Quick Actions */}
        <div className="lg:w-1/4 space-y-6">
          {/* Online Users */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Online Now ({onlineUsers.length})</h3>
            <div className="space-y-2">
              {onlineUsers.map(user => (
                <div key={user.id} className="flex items-center space-x-3 p-2 hover:bg-gray-700 rounded-lg transition-colors">
                  <div className="relative">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
                      {user.avatar}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center space-x-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-left">
                <span className="text-xl">📚</span>
                <span>Share Study Resources</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-left">
                <span className="text-xl">❓</span>
                <span>Ask a Question</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-left">
                <span className="text-xl">📅</span>
                <span>Schedule Next Session</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-left">
                <span className="text-xl">🏆</span>
                <span>Set Study Goals</span>
              </button>
            </div>
          </div>

          {/* Recent Files */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Recent Files</h3>
            <div className="space-y-2">
              {uploadedFiles.slice(0, 3).map(file => (
                <div key={file.id} className="flex items-center space-x-3 p-2 hover:bg-gray-700 rounded-lg transition-colors">
                  <span className="text-lg">{getFileIcon(file.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-gray-400">{file.uploadedBy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Study Stats */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Session Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Messages</span>
                <span className="font-semibold">{messages.reduce((acc, msg) => acc + 1 + msg.replies.length, 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Files Shared</span>
                <span className="font-semibold">{uploadedFiles.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Active Time</span>
                <span className="font-semibold">2h 15m</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Productivity</span>
                <span className="font-semibold text-green-500">85%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-3">
        <div className="flex justify-around">
          {['chat', 'files', 'whiteboard'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex flex-col items-center p-2 ${
                activeTab === tab ? 'text-blue-500' : 'text-gray-400'
              }`}
            >
              <span className="text-lg">
                {tab === 'chat' ? '💬' : tab === 'files' ? '📁' : '🎨'}
              </span>
              <span className="text-xs capitalize mt-1">{tab}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudyGroupSession;