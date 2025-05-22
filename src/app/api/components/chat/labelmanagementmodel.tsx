"use client";

import { useState } from 'react';

interface Label {
  id: string;
  name: string;
  color: string;
}

interface LabelManagementModalProps {
  labels: Label[];
  onClose: () => void;
  onCreateLabel: (labelData: { name: string, color: string }) => void;
}

const defaultColors = [
  '#FFA500', // Orange
  '#32CD32', // Lime Green
  '#FF6347', // Tomato
  '#4169E1', // Royal Blue
  '#9370DB', // Medium Purple
  '#20B2AA', // Light Sea Green
  '#FF69B4', // Hot Pink
  '#CD853F', // Peru
];

const LabelManagementModal = ({
  labels,
  onClose,
  onCreateLabel
}: LabelManagementModalProps) => {
  const [newLabelName, setNewLabelName] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>(defaultColors[0]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newLabelName.trim()) {
      alert('Please enter a label name');
      return;
    }
    
    onCreateLabel({
      name: newLabelName.trim(),
      color: selectedColor
    });
    
    setNewLabelName('');
    setSelectedColor(defaultColors[0]);
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Manage Labels</h3>
        </div>
        
        <div className="px-6 py-4">
          {/* Existing Labels */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Available Labels
            </h4>
            
            {labels.length === 0 ? (
              <p className="text-sm text-gray-500">No labels available</p>
            ) : (
              <div className="space-y-2">
                {labels.map((label) => (
                  <div key={label.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className="w-4 h-4 rounded-full mr-2"
                        style={{ backgroundColor: label.color }}
                      ></div>
                      <span className="text-sm text-gray-800">{label.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Create New Label */}
          <form onSubmit={handleSubmit}>
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Create New Label
            </h4>
            
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">
                Label Name
              </label>
              <input
                type="text"
                value={newLabelName}
                onChange={(e) => setNewLabelName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter label name"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">
                Label Color
              </label>
              <div className="flex flex-wrap gap-2">
                {defaultColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-8 h-8 rounded-full border-2 ${
                      selectedColor === color ? 'border-gray-800' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                  ></button>
                ))}
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-8 h-8 cursor-pointer"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Create Label
              </button>
            </div>
          </form>
        </div>
        
        <div className="px-6 py-3 bg-gray-50 text-right rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LabelManagementModal;
// import { useState, useEffect } from 'react';
// import { FaTimes, FaPlus, FaSpinner, FaTrash, FaCheck } from 'react-icons/fa';
// import { supabase } from './supabaseclient';

// interface Label {
//   id: string;
//   name: string;
//   color: string;
// }

// interface ChatLabel {
//   chat_id: string;
//   label_id: string;
//   labels?: Label;
// }

// interface LabelManagementModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   chatId: string;
//   onLabelsUpdated: () => void;
// }

// const colorOptions = [
//   { name: 'Gray', class: 'bg-gray-200 text-gray-800' },
//   { name: 'Red', class: 'bg-red-100 text-red-800' },
//   { name: 'Orange', class: 'bg-orange-100 text-orange-800' },
//   { name: 'Yellow', class: 'bg-yellow-100 text-yellow-800' },
//   { name: 'Green', class: 'bg-green-100 text-green-800' },
//   { name: 'Blue', class: 'bg-blue-100 text-blue-800' },
//   { name: 'Purple', class: 'bg-purple-100 text-purple-800' },
//   { name: 'Pink', class: 'bg-pink-100 text-pink-800' },
// ];

// const LabelManagementModal = ({ isOpen, onClose, chatId, onLabelsUpdated }: LabelManagementModalProps) => {
//   const [allLabels, setAllLabels] = useState<Label[]>([]);
//   const [chatLabels, setChatLabels] = useState<string[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [createMode, setCreateMode] = useState(false);
//   const [newLabelName, setNewLabelName] = useState('');
//   const [selectedColor, setSelectedColor] = useState(colorOptions[0].name.toLowerCase());
//   const [error, setError] = useState('');
//   const [savingLabel, setSavingLabel] = useState(false);
//   const [updatingLabels, setUpdatingLabels] = useState(false);

//   // Fetch all available labels and current chat labels
//   useEffect(() => {
//     if (!isOpen || !chatId) return;
    
//     const fetchLabels = async () => {
//       setLoading(true);
//       try {
//         // Fetch all labels
//         const { data: labelsData, error: labelsError } = await supabase
//           .from('labels')
//           .select('*')
//           .order('name');
          
//         if (labelsError) throw labelsError;
        
//         // Fetch labels assigned to this chat
//         const { data: chatLabelsData, error: chatLabelsError } = await supabase
//           .from('chat_labels')
//           .select(`
//             chat_id,
//             label_id,
//             labels: label_id (
//               id,
//               name,
//               color
//             )
//           `)
//           .eq('chat_id', chatId);
          
//         if (chatLabelsError) throw chatLabelsError;
        
//         setAllLabels(labelsData || []);
//         setChatLabels((chatLabelsData || []).map(cl => cl.label_id));
//       } catch (error) {
//         console.error('Error fetching labels:', error);
//         setError('Failed to load labels');
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchLabels();
//   }, [isOpen, chatId]);

//   const createNewLabel = async () => {
//     if (!newLabelName.trim()) {
//       setError('Label name cannot be empty');
//       return;
//     }
    
//     setSavingLabel(true);
//     setError('');
    
//     try {
//       // Create a new label
//       const { data: newLabel, error: createError } = await supabase
//         .from('labels')
//         .insert([
//           {
//             name: newLabelName.trim(),
//             color: selectedColor,
//             created_at: new Date().toISOString()
//           }
//         ])
//         .select();
        
//       if (createError) throw createError;
      
//       if (newLabel && newLabel.length > 0) {
//         // Add the new label to allLabels
//         setAllLabels(prev => [...prev, newLabel[0]]);
        
//         // Assign the new label to the chat
//         const { error: assignError } = await supabase
//           .from('chat_labels')
//           .insert([
//             {
//               chat_id: chatId,
//               label_id: newLabel[0].id,
//               created_at: new Date().toISOString()
//             }
//           ]);
          
//         if (assignError) throw assignError;
        
//         // Update chatLabels
//         setChatLabels(prev => [...prev, newLabel[0].id]);
//       }
      
//       // Reset the form
//       setNewLabelName('');
//       setSelectedColor(colorOptions[0].name.toLowerCase());
//       setCreateMode(false);
//     } catch (error) {
//       console.error('Error creating label:', error);
//       setError('Failed to create label');
//     } finally {
//       setSavingLabel(false);
//     }
//   };

//   const toggleLabelForChat = async (labelId: string) => {
//     setUpdatingLabels(true);
//     setError('');
    
//     try {
//       if (chatLabels.includes(labelId)) {
//         // Remove label from chat
//         const { error } = await supabase
//           .from('chat_labels')
//           .delete()
//           .eq('chat_id', chatId)
//           .eq('label_id', labelId);
          
//         if (error) throw error;
        
//         setChatLabels(prev => prev.filter(id => id !== labelId));
//       } else {
//         // Add label to chat
//         const { error } = await supabase
//           .from('chat_labels')
//           .insert([
//             {
//               chat_id: chatId,
//               label_id: labelId,
//               created_at: new Date().toISOString()
//             }
//           ]);
          
//         if (error) throw error;
        
//         setChatLabels(prev => [...prev, labelId]);
//       }
//     } catch (error) {
//       console.error('Error updating chat labels:', error);
//       setError('Failed to update labels');
//     } finally {
//       setUpdatingLabels(false);
//     }
//   };

//   const deleteLabel = async (labelId: string) => {
//     if (!confirm('Are you sure you want to delete this label? It will be removed from all chats.')) {
//       return;
//     }
    
//     setUpdatingLabels(true);
//     setError('');
    
//     try {
//       // First remove the label from all chats
//       const { error: removeError } = await supabase
//         .from('chat_labels')
//         .delete()
//         .eq('label_id', labelId);
        
//       if (removeError) throw removeError;
      
//       // Then delete the label itself
//       const { error: deleteError } = await supabase
//         .from('labels')
//         .delete()
//         .eq('id', labelId);
        
//       if (deleteError) throw deleteError;
      
//       // Update local state
//       setAllLabels(prev => prev.filter(label => label.id !== labelId));
//       setChatLabels(prev => prev.filter(id => id !== labelId));
//     } catch (error) {
//       console.error('Error deleting label:', error);
//       setError('Failed to delete label');
//     } finally {
//       setUpdatingLabels(false);
//     }
//   };

//   const handleSave = () => {
//     onLabelsUpdated();
//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-bold">Manage Labels</h2>
//           <button 
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700"
//           >
//             <FaTimes />
//           </button>
//         </div>

//         {error && (
//           <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md text-sm">
//             {error}
//           </div>
//         )}

//         {loading ? (
//           <div className="flex justify-center items-center py-8">
//             <FaSpinner className="animate-spin text-blue-600 h-8 w-8" />
//           </div>
//         ) : (
//           <>
//             {/* Assigned labels */}
//             <div className="mb-6">
//               <h3 className="text-sm font-medium text-gray-700 mb-2">Assigned Labels</h3>
//               {chatLabels.length === 0 ? (
//                 <p className="text-gray-500 text-sm">No labels assigned to this chat</p>
//               ) : (
//                 <div className="flex flex-wrap gap-2">
//                   {allLabels
//                     .filter(label => chatLabels.includes(label.id))
//                     .map(label => (
//                       <div 
//                         key={label.id}
//                         className={`flex items-center px-3 py-1 rounded-full text-sm ${getColorClass(label.color)}`}
//                       >
//                         {label.name}
//                         <button 
//                           onClick={() => toggleLabelForChat(label.id)}
//                           className="ml-2 text-xs opacity-60 hover:opacity-100"
//                           disabled={updatingLabels}
//                         >
//                           <FaTimes />
//                         </button>
//                       </div>
//                     ))
//                   }
//                 </div>
//               )}
//             </div>

//             {/* Create new label form */}
//             {createMode ? (
//               <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
//                 <h3 className="text-sm font-medium text-gray-700 mb-2">Create New Label</h3>
//                 <div className="mb-3">
//                   <input
//                     type="text"
//                     value={newLabelName}
//                     onChange={(e) => setNewLabelName(e.target.value)}
//                     placeholder="Label name"
//                     className="w-full p-2 border border-gray-300 rounded-md"
//                     disabled={savingLabel}
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label className="block text-sm text-gray-600 mb-1">Color</label>
//                   <div className="flex flex-wrap gap-2">
//                     {colorOptions.map(color => (
//                       <button
//                         key={color.name}
//                         onClick={() => setSelectedColor(color.name.toLowerCase())}
//                         className={`w-8 h-8 rounded-full ${color.class} flex items-center justify-center border ${
//                           selectedColor === color.name.toLowerCase() ? 'border-gray-800' : 'border-transparent'
//                         }`}
//                         disabled={savingLabel}
//                       >
//                         {selectedColor === color.name.toLowerCase() && <FaCheck size={12} />}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//                 <div className="flex justify-end space-x-2">
//                   <button
//                     onClick={() => setCreateMode(false)}
//                     className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
//                     disabled={savingLabel}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={createNewLabel}
//                     disabled={!newLabelName.trim() || savingLabel}
//                     className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm flex items-center"
//                   >
//                     {savingLabel ? <FaSpinner className="animate-spin mr-1" /> : <FaPlus className="mr-1" />}
//                     Create
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <button
//                 onClick={() => setCreateMode(true)}
//                 className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
//               >
//                 <FaPlus className="mr-1" />Add New Label
//               </button>
//             )}

//             {/* Available labels */}
//             <div>
//               <h3 className="text-sm font-medium text-gray-700 mb-2">Available Labels</h3>
//               {allLabels.length === 0 ? (
//                 <p className="text-gray-500 text-sm">No labels created yet</p>
//               ) : (
//                 <div className="max-h-64 overflow-y-auto">
//                   {allLabels.map(label => (
//                     <div 
//                       key={label.id}
//                       className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
//                     >
//                       <div className="flex items-center">
//                         <div 
//                           className={`w-4 h-4 rounded-full ${getColorClass(label.color)} mr-2`}
//                         />
//                         <span>{label.name}</span>
//                       </div>
//                       <div className="flex space-x-2">
//                         <button 
//                           onClick={() => toggleLabelForChat(label.id)}
//                           className={`text-sm px-2 py-1 rounded ${
//                             chatLabels.includes(label.id) 
//                               ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
//                               : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
//                           }`}
//                           disabled={updatingLabels}
//                         >
//                           {chatLabels.includes(label.id) ? 'Remove' : 'Add'}
//                         </button>
//                         <button 
//                           onClick={() => deleteLabel(label.id)}
//                           className="text-red-500 hover:text-red-700"
//                           disabled={updatingLabels}
//                         >
//                           <FaTrash size={14} />
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <div className="mt-6 flex justify-end">
//               <button
//                 onClick={handleSave}
//                 className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//               >
//                 Done
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// // Helper function to get Tailwind classes based on color name
// const getColorClass = (color: string): string => {
//   const colorMap: {[key: string]: string} = {
//     gray: 'bg-gray-200 text-gray-800',
//     red: 'bg-red-100 text-red-800',
//     orange: 'bg-orange-100 text-orange-800',
//     yellow: 'bg-yellow-100 text-yellow-800',
//     green: 'bg-green-100 text-green-800',
//     blue: 'bg-blue-100 text-blue-800',
//     purple: 'bg-purple-100 text-purple-800',
//     pink: 'bg-pink-100 text-pink-800'
//   };
  
//   return colorMap[color] || colorMap.gray;
// };

// export default LabelManagementModal;