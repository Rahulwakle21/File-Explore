import React, { useState } from 'react';

const initialFileStructure = {
  name: 'root',
  type: 'folder',
  children: [
    {
      name: 'Documents',
      type: 'folder',
      children: [
        { name: 'resume.pdf', type: 'file' },
        { name: 'coverletter.docx', type: 'file' }
      ]
    },
    {
      name: 'Pictures',
      type: 'folder',
      children: [
        { name: 'photo1.jpg', type: 'file' },
        
      ]
    }
  ]
};

const renderFileTree = (fileType, onFolderClick, onFileClick, onDelete, onRename) => {
  if (fileType.type === 'file') {
    return (
      <li key={fileType.name}>
        📄 {fileType.name}
        <button onClick={() => onDelete(fileType.name)}>Delete</button>
        <button onClick={() => onRename(fileType.name)}>Rename</button>
      </li>
    );
  }

  if (fileType.type === 'folder') {
    return (
      <li key={fileType.name}>
        📁 {fileType.name}
        <button onClick={() => onFolderClick(fileType)}>Open</button>
        <button onClick={() => onDelete(fileType.name)}>Delete</button>
        <button onClick={() => onRename(fileType.name)}>Rename</button>
        <ul>{fileType.children && fileType.children.map(child => renderFileTree(child, onFolderClick, onFileClick, onDelete, onRename))}</ul>
      </li>
    );
  }
};

const FileExplorer = () => {
  const [fileStructure, setFileStructure] = useState(initialFileStructure);
  const [currentFolder, setCurrentFolder] = useState(fileStructure);
  const [newItemName, setNewItemName] = useState('');
  const [isFolder, setIsFolder] = useState(true);


  const handleFolderClick = (folder) => {
    setCurrentFolder(folder);
  };

  
  const handleGoBack = () => {
    setCurrentFolder(fileStructure);
  };

  const handleAddItem = () => {
    if (!newItemName) return;

    const newItem = { name: newItemName, type: isFolder ? 'folder' : 'file', children: isFolder ? [] : null };
    const updatedFolder = { ...currentFolder, children: [...currentFolder.children, newItem] };

    setCurrentFolder(updatedFolder);
    setNewItemName('');
  };


  const handleDelete = (itemName) => {
    const updatedChildren = currentFolder.children.filter(child => child.name !== itemName);
    setCurrentFolder({ ...currentFolder, children: updatedChildren });
  };

  const handleRename = (itemName) => {
    const newName = prompt("Enter the new name:", itemName);
    if (!newName) return;

    const updatedChildren = currentFolder.children.map(child =>
      child.name === itemName ? { ...child, name: newName } : child
    );
    setCurrentFolder({ ...currentFolder, children: updatedChildren });
  };

  return (
    <div>
      <h2>File Explorer</h2>

      <div>
        <input
          type="text"
          placeholder="New item name"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
        />
        <select onChange={(e) => setIsFolder(e.target.value === 'folder')} value={isFolder ? 'folder' : 'file'}>
          <option value="folder">Folder</option>
          <option value="file">File</option>
        </select>
        <button onClick={handleAddItem}>Add</button>
      </div>

      {currentFolder !== fileStructure && <button onClick={handleGoBack}>Go Back</button>}

      <ul>
        {currentFolder.children && currentFolder.children.map(child =>
          renderFileTree(child, handleFolderClick, () => {}, handleDelete, handleRename)
        )}
      </ul>
    </div>
  );
};

export default FileExplorer;
