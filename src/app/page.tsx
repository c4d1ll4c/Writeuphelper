'use client';

import React from "react";
import { TextExport } from "@/components/TextExport";
import { FileItem, TaskList, generateUniqueId } from "@/lib/utils";

// Template-specific placeholders
const TASK_TEMPLATES = [
  { id: 'specialty-initial', label: '1. Specialty - Color Comp Initial Setup' },
  { id: 'specialty-presslay', label: '2. Specialty - Presslay Setup' },
  { id: 'specialty-gf-device', label: '3. Specialty - GF Device' },
  { id: 'specialty-final-production', label: '4. Specialty - Final Production Setup' },
  // Add more templates here in the future
];

// Template-specific placeholders
const TEMPLATE_PLACEHOLDERS: Record<string, any> = {
  'specialty-initial': {
    jobLocation: 'Enter Job Folder Location',
    dieLocation: 'Enter Die Location',
    artLocation: 'Enter High-Res Art Location',
    renderLocation: 'Enter Render Location',
    emailTo: 'Enter Email Recipients',
  },
  'specialty-presslay': {
    jobLocation: 'Enter Job Folder Location',
    dieLocation: 'Enter Die Location',
    artLocation: 'Enter High-Res Art Location',
    renderLocation: 'Enter Render Location',
    emailTo: 'Enter Email Recipients',
  },
  'specialty-gf-device': {
    jobLocation: 'Enter Job Folder Location',
    dieLocation: 'Enter Die Location',
    artLocation: 'Enter High-Res Art Location',
    renderLocation: 'Enter Render Location',
    emailTo: 'Enter Email Recipients',
  },
  'specialty-final-production': {
    jobLocation: 'Enter Job Folder Location',
    artLocation: 'Enter Approved Device Cap Location',
    renderLocation: 'Enter Print Specs Location',
    emailTo: 'Enter Email Recipients (GF Planning, Structural Design)',
  }
};

export default function Home() {
  const [selectedTemplate, setSelectedTemplate] = React.useState(TASK_TEMPLATES[0].id);
  
  // Direct template placeholder fields
  const [jobLocation, setJobLocation] = React.useState("");
  const [dieLocation, setDieLocation] = React.useState("");
  const [dieType, setDieType] = React.useState("All Flatbeds");
  const [artLocation, setArtLocation] = React.useState("");
  const [materialType, setMaterialType] = React.useState("8oz");
  const [renderLocation, setRenderLocation] = React.useState("");
  const [takeToLocation, setTakeToLocation] = React.useState("Engineering");
  const [printSpecsLocation, setPrintSpecsLocation] = React.useState("");
  const [emailTo, setEmailTo] = React.useState("");
  
  const [taskList, setTaskList] = React.useState<TaskList | null>(null);

  // Get current template's placeholders
  const currentPlaceholders = TEMPLATE_PLACEHOLDERS[selectedTemplate as keyof typeof TEMPLATE_PLACEHOLDERS] || TEMPLATE_PLACEHOLDERS['specialty-initial'];

  // Check if the current template has dieLocation
  const hasDieLocation = selectedTemplate !== 'specialty-final-production';

  // Label texts based on template
  const getFieldLabels = () => {
    if (selectedTemplate === 'specialty-presslay') {
      return {
        jobLocation: 'Job Folder Location',
        dieLocation: 'Die Location',
        artLocation: 'High-Res Art Location',
        renderLocation: 'Render Location',
        emailTo: 'Email Recipients'
      };
    }
    if (selectedTemplate === 'specialty-gf-device') {
      return {
        jobLocation: 'Job Folder Location',
        dieLocation: 'Printers',
        artLocation: 'Material',
        renderLocation: 'Take To',
        emailTo: 'Email Recipients'
      };
    }
    if (selectedTemplate === 'specialty-final-production') {
      return {
        jobLocation: 'Job Folder Location',
        artLocation: 'Approved Device Cap Location',
        renderLocation: 'Print Specs Location',
        emailTo: 'Email Recipients'
      };
    }
    return {
      jobLocation: 'Job Folder Location',
      dieLocation: 'Die Location',
      artLocation: 'High-Res Art Location',
      renderLocation: 'Render Location',
      emailTo: 'Email Recipients'
    };
  };

  const fieldLabels = getFieldLabels();

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTemplate(e.target.value);
    // Reset task list when template changes
    setTaskList(null);
  };

  const handleGenerateTask = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!jobLocation) {
      alert("Job location is required");
      return;
    }
    
    // Create virtual files for each placeholder
    const files: FileItem[] = [];
    
    // Job folder location
    files.push({
      id: generateUniqueId(),
      fileName: "Job Folder",
      fileLocation: jobLocation,
      description: "Job folder location",
      completed: false
    });
    
    // Handle GF Device template
    if (selectedTemplate === 'specialty-gf-device') {
      // 1. Set up files for GF Device
      files.push({
        id: generateUniqueId(),
        fileName: "1. Set up files",
        fileLocation: "GF Device",
        description: "Set up files for GF Device",
        completed: false
      });
      
      // 2. Die File
      files.push({
        id: generateUniqueId(),
        fileName: "2. Die File",
        fileLocation: dieType,
        description: "Engineering die file",
        completed: false
      });
      
      // 3. Art File
      files.push({
        id: generateUniqueId(),
        fileName: "3. Art File",
        fileLocation: materialType,
        description: "Material",
        completed: false
      });
      
      // 4. Render
      files.push({
        id: generateUniqueId(),
        fileName: "4. Render",
        fileLocation: takeToLocation,
        description: "Take To location",
        completed: false
      });
      
      // 5. Add print specs location if GF Zund is selected and specs location is provided
      if (takeToLocation === 'GF Zund' && printSpecsLocation) {
        files.push({
          id: generateUniqueId(),
          fileName: "5. Print Specs",
          fileLocation: printSpecsLocation,
          description: "Print specs location",
          completed: false
        });
      }

      // 6. Email contact
      if (emailTo) {
        files.push({
          id: generateUniqueId(),
          fileName: "6. Email Contact",
          fileLocation: emailTo,
          description: "Email recipients for GF Device",
          completed: false
        });
      }
    } 
    // Handle Final Production template
    else if (selectedTemplate === 'specialty-final-production') {
      // 1. Set up files for FINAL PRODUCTION
      files.push({
        id: generateUniqueId(),
        fileName: "1. Set up files",
        fileLocation: "FINAL PRODUCTION",
        description: "CROP THE PDFS IF NEEDED",
        completed: false
      });
      
      // 2. Copy dies to Zund hotfolder
      files.push({
        id: generateUniqueId(),
        fileName: "2. Copy dies",
        fileLocation: "Zund hotfolder",
        description: "Copy the dies to the Zund hotfolder",
        completed: false
      });
      
      // 3. Send approved presslays to GF Final Production
      files.push({
        id: generateUniqueId(),
        fileName: "3. Send to GF Final Production",
        fileLocation: "GF Final Production",
        description: "Send the approved presslays to GF Final Production",
        completed: false
      });
      
      // 3a. Approved Device Cap
      if (artLocation) {
        files.push({
          id: generateUniqueId(),
          fileName: "3a. Approved Device Cap",
          fileLocation: artLocation,
          description: "Approved Device Cap location",
          completed: false
        });
      }
      
      // 3b. PDFs note
      files.push({
        id: generateUniqueId(),
        fileName: "3b. Email PDFs and PrintSpecs PDF",
        fileLocation: "Job folder",
        description: "Email PDFs and PrintSpecs PDF can be found in the job folder",
        completed: false
      });
      
      // 3c. Print Specs Location
      if (renderLocation) {
        files.push({
          id: generateUniqueId(),
          fileName: "3c. Print Specs Location",
          fileLocation: renderLocation,
          description: "Print Specs Location",
          completed: false
        });
      }
      
      // 4. Email GF Planning, Structural Design
      if (emailTo) {
        files.push({
          id: generateUniqueId(),
          fileName: "4. Email GF Planning, Structural Design",
          fileLocation: emailTo,
          description: "Email GF Planning, Structural Design & " + emailTo,
          completed: false
        });
      }
      
      // 5. Task Complete in Monarch
      files.push({
        id: generateUniqueId(),
        fileName: "5. Task Complete in Monarch",
        fileLocation: "Monarch",
        description: "Mark task as complete in Monarch",
        completed: false
      });
    } 
    // Handle other templates
    else {
      // Die file
      if (dieLocation) {
        files.push({
          id: generateUniqueId(),
          fileName: "Die File",
          fileLocation: dieLocation,
          description: "Engineering die file",
          completed: false
        });
      }
      
      // Art file
      if (artLocation) {
        files.push({
          id: generateUniqueId(),
          fileName: "Art File",
          fileLocation: artLocation,
          description: "Premedia art file",
          completed: false
        });
      }
      
      // Render file
      if (renderLocation) {
        files.push({
          id: generateUniqueId(),
          fileName: "Render",
          fileLocation: renderLocation,
          description: "Approved render for FPO",
          completed: false
        });
      }
      
      // Email contact
      if (emailTo) {
        files.push({
          id: generateUniqueId(),
          fileName: "Email Contact",
          fileLocation: emailTo,
          description: "Approval contact",
          completed: false
        });
      }
    }
    
    // Generate task list
    const newTaskList: TaskList = {
      id: generateUniqueId(),
      title: "Task " + new Date().toLocaleDateString(),
      files: files,
      createdAt: new Date(),
      updatedAt: new Date(),
      version: taskList ? taskList.version + 1 : 1,
      templateId: selectedTemplate
    };
    
    setTaskList(newTaskList);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-6">
        <section className="text-center py-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-accent via-secondary to-primary bg-clip-text text-transparent">
            Task Generator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            Create a simple to read and organized task for your production workflow.
          </p>
          
          {/* Task Template Selector */}
          <div className="flex justify-center mb-4">
            <div className="w-full max-w-md">
              <label htmlFor="task-template" className="block text-sm font-medium text-muted-foreground mb-1">
                Select Task Template
              </label>
              <div className="relative group">
                <select
                  id="task-template"
                  value={selectedTemplate}
                  onChange={handleTemplateChange}
                  className="w-full rounded-md appearance-none bg-background border border-accent/20 shadow-sm py-2.5 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-accent/30 hover:border-accent/50 transition-all duration-200"
                >
                  {TASK_TEMPLATES.map(template => (
                    <option key={template.id} value={template.id}>{template.label}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-5 w-5 text-accent" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-accent via-secondary to-primary group-hover:w-full transition-all duration-300"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Input Section - Always visible */}
        <div className="bg-card rounded-lg shadow-lg p-6 border-0">
          <h2 className="text-2xl font-semibold mb-6">Task Information</h2>
          
          <form onSubmit={handleGenerateTask} className="space-y-4">
            <div>
              <label htmlFor="job-location" className="block text-sm font-medium text-foreground mb-1">
                {fieldLabels.jobLocation}
              </label>
              <div className="relative group">
                <input
                  type="text"
                  id="job-location"
                  value={jobLocation}
                  onChange={(e) => setJobLocation(e.target.value)}
                  className="w-full rounded-md bg-background border border-accent/20 shadow-sm py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-accent/30 hover:border-accent/50 transition-all duration-200"
                  placeholder={currentPlaceholders.jobLocation}
                  required
                />
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-accent via-secondary to-primary group-hover:w-full transition-all duration-300"></div>
              </div>
            </div>
            
            {selectedTemplate === 'specialty-gf-device' ? (
              <div>
                <label htmlFor="die-type" className="block text-sm font-medium text-foreground mb-1">
                  {fieldLabels.dieLocation}
                </label>
                <div className="relative group">
                  <select
                    id="die-type"
                    value={dieType}
                    onChange={(e) => setDieType(e.target.value)}
                    className="w-full rounded-md appearance-none bg-background border border-accent/20 shadow-sm py-2.5 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-accent/30 hover:border-accent/50 transition-all duration-200"
                  >
                    <option value="All Flatbeds">All Flatbeds</option>
                    <option value="All Rolls">All Rolls</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-accent" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-accent via-secondary to-primary group-hover:w-full transition-all duration-300"></div>
                </div>
              </div>
            ) : (
              selectedTemplate !== 'specialty-final-production' && (
                <div>
                  <label htmlFor="die-location" className="block text-sm font-medium text-foreground mb-1">
                    {fieldLabels.dieLocation}
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      id="die-location"
                      value={dieLocation}
                      onChange={(e) => setDieLocation(e.target.value)}
                      className="w-full rounded-md bg-background border border-accent/20 shadow-sm py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-accent/30 hover:border-accent/50 transition-all duration-200"
                      placeholder={currentPlaceholders.dieLocation}
                    />
                    <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-accent via-secondary to-primary group-hover:w-full transition-all duration-300"></div>
                  </div>
                </div>
              )
            )}
            
            {selectedTemplate === 'specialty-gf-device' ? (
              <div>
                <label htmlFor="material-type" className="block text-sm font-medium text-foreground mb-1">
                  {fieldLabels.artLocation}
                </label>
                <div className="relative group">
                  <select
                    id="material-type"
                    value={materialType}
                    onChange={(e) => setMaterialType(e.target.value)}
                    className="w-full rounded-md appearance-none bg-background border border-accent/20 shadow-sm py-2.5 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-accent/30 hover:border-accent/50 transition-all duration-200"
                  >
                    <option value="8oz">8oz</option>
                    <option value="C1S">C1S</option>
                    <option value="RTS">RTS</option>
                    <option value="Busmark">Busmark</option>
                    <option value="Lightcal">Lightcal</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-accent" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-accent via-secondary to-primary group-hover:w-full transition-all duration-300"></div>
                </div>
              </div>
            ) : (
              <div>
                <label htmlFor="art-location" className="block text-sm font-medium text-foreground mb-1">
                  {fieldLabels.artLocation}
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    id="art-location"
                    value={artLocation}
                    onChange={(e) => setArtLocation(e.target.value)}
                    className="w-full rounded-md bg-background border border-accent/20 shadow-sm py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-accent/30 hover:border-accent/50 transition-all duration-200"
                    placeholder={currentPlaceholders.artLocation}
                  />
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-accent via-secondary to-primary group-hover:w-full transition-all duration-300"></div>
                </div>
              </div>
            )}
            
            {selectedTemplate === 'specialty-gf-device' ? (
              <div>
                <label htmlFor="take-to-location" className="block text-sm font-medium text-foreground mb-1">
                  {fieldLabels.renderLocation}
                </label>
                <div className="relative group">
                  <select
                    id="take-to-location"
                    value={takeToLocation}
                    onChange={(e) => setTakeToLocation(e.target.value)}
                    className="w-full rounded-md appearance-none bg-background border border-accent/20 shadow-sm py-2.5 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-accent/30 hover:border-accent/50 transition-all duration-200"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="GF Zund">GF Zund</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-accent" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-accent via-secondary to-primary group-hover:w-full transition-all duration-300"></div>
                </div>
              </div>
            ) : (
              <div>
                <label htmlFor="render-location" className="block text-sm font-medium text-foreground mb-1">
                  {fieldLabels.renderLocation}
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    id="render-location"
                    value={renderLocation}
                    onChange={(e) => setRenderLocation(e.target.value)}
                    className="w-full rounded-md bg-background border border-accent/20 shadow-sm py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-accent/30 hover:border-accent/50 transition-all duration-200"
                    placeholder={currentPlaceholders.renderLocation}
                  />
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-accent via-secondary to-primary group-hover:w-full transition-all duration-300"></div>
                </div>
              </div>
            )}
            
            {/* Print Specs Location field - only shown when GF Zund is selected in template 3 */}
            {selectedTemplate === 'specialty-gf-device' && takeToLocation === 'GF Zund' && (
              <div>
                <label htmlFor="print-specs-location" className="block text-sm font-medium text-foreground mb-1">
                  Print Specs Location
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    id="print-specs-location"
                    value={printSpecsLocation}
                    onChange={(e) => setPrintSpecsLocation(e.target.value)}
                    className="w-full rounded-md bg-background border border-accent/20 shadow-sm py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-accent/30 hover:border-accent/50 transition-all duration-200"
                    placeholder="Enter Print Specs Location"
                  />
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-accent via-secondary to-primary group-hover:w-full transition-all duration-300"></div>
                </div>
              </div>
            )}
            
            {selectedTemplate !== 'specialty-gf-device' && (
              <div>
                <label htmlFor="email-to" className="block text-sm font-medium text-foreground mb-1">
                  {fieldLabels.emailTo}
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    id="email-to"
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    className="w-full rounded-md bg-background border border-accent/20 shadow-sm py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-accent/30 hover:border-accent/50 transition-all duration-200"
                    placeholder={currentPlaceholders.emailTo}
                  />
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-accent via-secondary to-primary group-hover:w-full transition-all duration-300"></div>
                </div>
              </div>
            )}
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-accent text-accent-foreground text-sm font-medium rounded-md hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
              >
                Generate Task
              </button>
            </div>
          </form>
        </div>
        
        {/* Copyable Text Output - Shows automatically when a file is added */}
        {taskList ? (
          <div className="bg-card rounded-lg shadow-lg p-6 border-0">
            <div className="border-0">
              <h3 className="text-2xl font-semibold mb-6">Task</h3>
              <TextExport taskList={taskList} />
            </div>
          </div>
        ) : (
          <div className="hidden">No task generated yet</div>
        )}
      </div>
    </div>
  );
} 