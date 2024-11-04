import React, { useState } from 'react';
import { X, Upload, Plus } from 'lucide-react';
import SelectSearch from './SelectSearch';

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockClients = [
  { value: 'webtic', label: 'Webtic De Colombia' },
  { value: 'acme', label: 'Acme Corp' },
];

const mockUsers = [
  { value: 'jose', label: 'JOSE ZAPATA' },
  { value: 'maria', label: 'MARIA RODRIGUEZ' },
];

const mockAreas = [
  { value: 'development', label: 'Desarrollo' },
  { value: 'support', label: 'Soporte' },
  { value: 'sales', label: 'Ventas' },
];

const mockCategories = [
  { value: 'bug', label: 'Error' },
  { value: 'feature', label: 'Nueva Funcionalidad' },
  { value: 'question', label: 'Consulta' },
];

const mockSubcategories = {
  bug: [
    { value: 'critical', label: 'Crítico' },
    { value: 'major', label: 'Mayor' },
    { value: 'minor', label: 'Menor' },
  ],
  feature: [
    { value: 'enhancement', label: 'Mejora' },
    { value: 'new', label: 'Nuevo' },
  ],
  question: [
    { value: 'technical', label: 'Técnica' },
    { value: 'business', label: 'Negocio' },
  ],
};

export default function CreateTicketModal({ isOpen, onClose }: CreateTicketModalProps) {
  const [client, setClient] = useState('');
  const [priority, setPriority] = useState('default');
  const [requester, setRequester] = useState('');
  const [subject, setSubject] = useState('');
  const [area, setArea] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="relative inline-block w-full max-w-3xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-6">
            CREAR NUEVO TICKET
          </h3>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SelectSearch
                label="Cliente"
                options={mockClients}
                value={mockClients.find(c => c.value === client)}
                onChange={(option) => setClient(option?.value || '')}
                placeholder="Seleccione cliente..."
              />

              <div>
                <label className="block text-sm font-medium text-gray-700">Prioridad</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="default">Por defecto</option>
                  <option value="high">Alta</option>
                  <option value="medium">Media</option>
                  <option value="low">Baja</option>
                </select>
              </div>

              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <SelectSearch
                    label="Solicitante"
                    options={mockUsers}
                    value={mockUsers.find(u => u.value === requester)}
                    onChange={(option) => setRequester(option?.value || '')}
                    placeholder="Seleccione solicitante..."
                  />
                </div>
                <button
                  type="button"
                  className="mb-[2px] p-2 text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Asunto</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Asunto..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SelectSearch
                label="Área"
                options={mockAreas}
                value={mockAreas.find(a => a.value === area)}
                onChange={(option) => setArea(option?.value || '')}
                placeholder="Seleccione proceso..."
              />

              <SelectSearch
                label="Categoría"
                options={mockCategories}
                value={mockCategories.find(c => c.value === category)}
                onChange={(option) => {
                  setCategory(option?.value || '');
                  setSubcategory('');
                }}
                placeholder="Seleccione..."
              />

              <SelectSearch
                label="Subcategoría"
                options={category ? mockSubcategories[category as keyof typeof mockSubcategories] : []}
                value={mockSubcategories[category as keyof typeof mockSubcategories]?.find(s => s.value === subcategory)}
                onChange={(option) => setSubcategory(option?.value || '')}
                placeholder="Seleccione..."
                isDisabled={!category}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Descripción del problema
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Descripción de su Problema"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adjuntos
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 ${
                  dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-1 text-sm text-gray-600">
                    Arrastre y suelte aquí los archivos ...
                  </p>
                  <div className="mt-2">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="mt-2 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                        Seleccionar archivos...
                      </span>
                      <input
                        id="file-upload"
                        type="file"
                        multiple
                        className="sr-only"
                        onChange={handleFileSelect}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {files.length > 0 && (
                <ul className="mt-4 divide-y divide-gray-200">
                  {files.map((file, index) => (
                    <li key={index} className="py-2 flex justify-between items-center">
                      <div className="flex items-center">
                        <Upload className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{file.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                CERRAR
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
              >
                CREAR NUEVO CASO
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}