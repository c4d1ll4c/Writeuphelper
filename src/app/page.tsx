'use client';

import React from "react";
import { TextExport } from "@/components/TextExport";
import { FileItem, TaskList, generateUniqueId } from "@/lib/utils";

// Template-specific placeholders
const TASK_TEMPLATES = [
  { id: 'template1', label: '1. Specialty - Color Comp Initial Setup' },
  { id: 'template2', label: '2. Specialty - Presslay Setup' },
  { id: 'template3', label: '3. Specialty - GF Device' },
  { id: 'template4', label: '4. Specialty - Final Production Setup' },
];

// Template-specific placeholders
const TEMPLATE_PLACEHOLDERS: Record<string, any> = {
  'template1': {
    jobLocation: 'Enter Job Folder Location',
    dieLocation: 'Enter Die Location',
    artLocation: 'Enter High-Res Art Location',
    renderLocation: 'Enter Render Location',
    emailTo: 'Enter Email Recipients',
  },
  'template2': {
    jobLocation: 'Enter Job Folder Location',
    dieLocation: 'Enter Die Location',
    artLocation: 'Enter High-Res Art Location',
    renderLocation: 'Enter Render Location',
    emailTo: 'Enter Email Recipients',
  },
  'template3': {
    jobLocation: 'Enter Job Folder Location',
    dieLocation: 'Enter Die Location',
    artLocation: 'Enter High-Res Art Location',
    renderLocation: 'Enter Render Location',
    emailTo: 'Enter Email Recipients',
  },
  'template4': {
    jobLocation: 'Enter Job Folder Location',
    artLocation: 'Enter Approved Device Cap Location',
    renderLocation: 'Enter Print Specs Location',
    emailTo: 'Enter Email Recipients (GF Planning, Structural Design)',
  }
};

export default function Home() {
  const [selectedTemplate, setSelectedTemplate] = React.useState(TASK_TEMPLATES[0].id);
  const [templateContent, setTemplateContent] = React.useState<string>('');
  
  // Form state
  const [jobLocation, setJobLocation] = React.useState("");
  const [dieLocation, setDieLocation] = React.useState("");
  const [dieType, setDieType] = React.useState("All Flatbeds");
  const [artLocation, setArtLocation] = React.useState("");
  const [materialType, setMaterialType] = React.useState("8oz");
  const [renderLocation, setRenderLocation] = React.useState("");
  const [takeTo, setTakeTo] = React.useState("Engineering");
  const [printSpecsLocation, setPrintSpecsLocation] = React.useState("");
  const [emailTo, setEmailTo] = React.useState("");
  const [approvedDeviceLocation, setApprovedDeviceLocation] = React.useState("");
  
  const [taskList, setTaskList] = React.useState<TaskList | null>(null);
  const [copied, setCopied] = React.useState(false);

  // Get current template's placeholders
  const currentPlaceholders = TEMPLATE_PLACEHOLDERS[selectedTemplate] || TEMPLATE_PLACEHOLDERS['template1'];

  // Check if the current template has dieLocation
  const hasDieLocation = selectedTemplate !== 'template4';

  // Label texts based on template
  const getFieldLabels = () => {
    if (selectedTemplate === 'template2') {
      return {
        jobLocation: 'Job Folder Location',
        dieLocation: 'Die Location',
        artLocation: 'High-Res Art Location',
        renderLocation: 'Render Location',
        emailTo: 'Email Recipients'
      };
    }
    if (selectedTemplate === 'template3') {
      return {
        jobLocation: 'Job Folder Location',
        dieLocation: 'Printers',
        artLocation: 'Material',
        renderLocation: 'Take To',
        emailTo: 'Email Recipients'
      };
    }
    if (selectedTemplate === 'template4') {
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

  // Fetch template content when template is selected
  React.useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await fetch(`/api/templates?name=${selectedTemplate}`);
        const data = await response.json();
        if (data.content) {
          setTemplateContent(data.content);
        }
      } catch (error) {
        console.error('Error fetching template:', error);
      }
    };
    fetchTemplate();
  }, [selectedTemplate]);

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTemplate(e.target.value);
    // Reset task list when template changes
    setTaskList(null);
  };

  const handleJobLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJobLocation(e.target.value);
  };

  const handleDieLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDieLocation(e.target.value);
  };

  const handleDieTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDieType(e.target.value);
  };

  const handleArtLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setArtLocation(e.target.value);
  };

  const handleMaterialTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMaterialType(e.target.value);
  };

  const handleRenderLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRenderLocation(e.target.value);
  };

  const handleTakeToChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTakeTo(e.target.value);
  };

  const handlePrintSpecsLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrintSpecsLocation(e.target.value);
  };

  const handleEmailToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailTo(e.target.value);
  };

  const handleGenerateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobLocation) {
      alert("Job location is required");
      return;
    }

    // Replace placeholders in templateContent with form values
    let filledTask = templateContent;
    switch (selectedTemplate) {
      case 'template1':
        filledTask = filledTask
          .replace(/\[Enter Job Folder Location\]/g, jobLocation)
          .replace(/\[Enter Die Location\]/g, dieLocation)
          .replace(/\[Enter High-Res Art Location\]/g, artLocation)
          .replace(/\[Enter Render Location\]/g, renderLocation)
          .replace(/\[Enter Email Recipients\]/g, emailTo);
        break;
      case 'template2':
        filledTask = filledTask
          .replace(/\[Enter Job Folder Location\]/g, jobLocation)
          .replace(/\[Enter Die Location\]/g, dieLocation)
          .replace(/\[Enter High-Res Art Location\]/g, artLocation)
          .replace(/\[Enter Render Location\]/g, renderLocation)
          .replace(/\[Enter Email Recipients\]/g, emailTo);
        break;
      case 'template3':
        let template3Task = "";
        const cropLine = dieType === 'All Flatbeds' ? '\n - CROP THE PDFs TO FIT ON THE MATERIAL' : '';
        if (takeTo === 'Engineering') {
          template3Task = `[Enter Job Folder Location]\n\nAFTER PDF APPROVAL:\n1. Save out PDF(s) without dies\n - Check to make sure the color space is correct${cropLine}\n2. Send to GF Device.\n - [Printer]\n - Material: [Material]\n - Special Instructions: Take to [Take to]\n3. Email the dies to Engineering.`;
        } else if (takeTo === 'GF Zund') {
          template3Task = `[Enter Job Folder Location]\n\nAFTER PDF APPROVAL:\n1. Save out PDF(s) without dies\n - Check to make sure the color space is correct${cropLine}\n2. Send to GF Device.\n - [Printer]\n - Material: [Material]\n - Special Instructions: Take to [Take to]  |  See Zund hotfolder for the mounting specs PDF.\n3. Copy the dies and the PrintSpecs.pdf into the Zund hotfolder for GF to mount and cut.\n - Print Specs Location: [Print Specs Location]`;
        }
        filledTask = template3Task
          .replace(/\[Enter Job Folder Location\]/g, jobLocation)
          .replace(/\[Printer\]/g, dieType)
          .replace(/\[Material\]/g, materialType)
          .replace(/\[Take to\]/g, takeTo)
          .replace(/\[Print Specs Location\]/g, printSpecsLocation);
        break;
      case 'template4':
        filledTask = filledTask
          .replace(/\[Enter Job Folder Location\]/g, jobLocation)
          .replace(/\[Approved Device Location\]/g, approvedDeviceLocation)
          .replace(/\[Print Specs Location\]/g, printSpecsLocation)
          .replace(/\[Enter Email Recipients\]/g, emailTo);
        break;
      default:
        break;
    }

    // Generate task list with filled template
    const newTaskList: TaskList = {
      id: generateUniqueId(),
      title: "Task " + new Date().toLocaleDateString(),
      files: [], // Not used for template-based output
      createdAt: new Date(),
      updatedAt: new Date(),
      version: taskList ? taskList.version + 1 : 1,
      templateId: selectedTemplate,
      content: filledTask
    };

    setTaskList(newTaskList);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
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
            {/* Template 1 fields */}
            {selectedTemplate === 'template1' && (
              <>
                <div>
                  <label htmlFor="job-location" className="block text-sm font-medium text-foreground mb-1">Job Folder Location</label>
                  <div className="relative group">
                    <input type="text" id="job-location" value={jobLocation} onChange={handleJobLocationChange} className="w-full rounded-md bg-background border border-accent/20 shadow-sm py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-accent/30 hover:border-accent/50 transition-all duration-200" placeholder="Enter Job Folder Location" required />
                  </div>
                </div>
                <div>
                  <label htmlFor="die-location" className="block text-sm font-medium text-foreground mb-1">Die Location</label>
                  <div className="relative group">
                    <input type="text" id="die-location" value={dieLocation} onChange={handleDieLocationChange} className="w-full rounded-md bg-background border border-accent/20 shadow-sm py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-accent/30 hover:border-accent/50 transition-all duration-200" placeholder="Enter Die Location" />
                  </div>
                </div>
                <div>
                  <label htmlFor="art-location" className="block text-sm font-medium text-foreground mb-1">High-Res Art Location</label>
                  <div className="relative group">
                    <input type="text" id="art-location" value={artLocation} onChange={handleArtLocationChange} className="w-full rounded-md bg-background border border-accent/20 shadow-sm py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-accent/30 hover:border-accent/50 transition-all duration-200" placeholder="Enter High-Res Art Location" />
                  </div>
                </div>
                <div>
                  <label htmlFor="render-location" className="block text-sm font-medium text-foreground mb-1">Render Location</label>
                  <div className="relative group">
                    <input type="text" id="render-location" value={renderLocation} onChange={handleRenderLocationChange} className="w-full rounded-md bg-background border border-accent/20 shadow-sm py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-accent/30 hover:border-accent/50 transition-all duration-200" placeholder="Enter Render Location" />
                  </div>
                </div>
                <div>
                  <label htmlFor="email-to" className="block text-sm font-medium text-foreground mb-1">Email Recipients</label>
                  <div className="relative group">
                    <input type="text" id="email-to" value={emailTo} onChange={handleEmailToChange} className="w-full rounded-md bg-background border border-accent/20 shadow-sm py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-accent/30 hover:border-accent/50 transition-all duration-200" placeholder="Enter Email Recipients" />
                  </div>
                </div>
              </>
            )}

            {/* Template 2 fields */}
            {selectedTemplate === 'template2' && (
              <>
                <div>
                  <label htmlFor="job-location" className="block text-sm font-medium text-foreground mb-1">Job Folder Location</label>
                  <div className="relative group">
                    <input type="text" id="job-location" value={jobLocation} onChange={handleJobLocationChange} className="w-full rounded-md bg-background border border-accent/20 shadow-sm py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-accent/30 hover:border-accent/50 transition-all duration-200" placeholder="Enter Job Folder Location" required />
                  </div>
                </div>
                <div>
                  <label htmlFor="die-location" className="block text-sm font-medium text-foreground mb-1">Die Location</label>
                  <div className="relative group">
                    <input type="text" id="die-location" value={dieLocation} onChange={handleDieLocationChange} className="w-full rounded-md bg-background border border-accent/20 shadow-sm py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-accent/30 hover:border-accent/50 transition-all duration-200" placeholder="Enter Die Location" />
                  </div>
                </div>
                <div>
                  <label htmlFor="art-location" className="block text-sm font-medium text-foreground mb-1">High-Res Art Location</label>
                  <div className="relative group">
                    <input type="text" id="art-location" value={artLocation} onChange={handleArtLocationChange} className="w-full rounded-md bg-background border border-accent/20 shadow-sm py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-accent/30 hover:border-accent/50 transition-all duration-200" placeholder="Enter High-Res Art Location" />
                  </div>
                </div>
                <div>
                  <label htmlFor="render-location" className="block text-sm font-medium text-foreground mb-1">Render Location</label>
                  <div className="relative group">
                    <input type="text" id="render-location" value={renderLocation} onChange={handleRenderLocationChange} className="w-full rounded-md bg-background border border-accent/20 shadow-sm py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-accent/30 hover:border-accent/50 transition-all duration-200" placeholder="Enter Render Location" />
                  </div>
                </div>
                <div>
                  <label htmlFor="email-to" className="block text-sm font-medium text-foreground mb-1">Email Recipients</label>
                  <div className="relative group">
                    <input type="text" id="email-to" value={emailTo} onChange={handleEmailToChange} className="w-full rounded-md bg-background border border-accent/20 shadow-sm py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-accent/30 hover:border-accent/50 transition-all duration-200" placeholder="Enter Email Recipients" />
                  </div>
                </div>
              </>
            )}

            {/* Template 3 fields */}
            {selectedTemplate === 'template3' && (
              <>
                <div>
                  <label htmlFor="job-location" className="block text-sm font-medium text-foreground mb-1">Job Folder Location</label>
                  <div className="relative group">
                    <input type="text" id="job-location" value={jobLocation} onChange={handleJobLocationChange} className="w-full rounded-md bg-background border border-accent/20 shadow-sm py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-accent/30 hover:border-accent/50 transition-all duration-200" placeholder="Enter Job Folder Location" required />
                  </div>
                </div>
                <div>
                  <label htmlFor="die-type" className="block text-sm font-medium text-foreground mb-1">Printers</label>
                  <div className="relative group">
                    <select id="die-type" value={dieType} onChange={handleDieTypeChange} className="w-full rounded-md appearance-none bg-background border border-accent/20 shadow-sm py-2.5 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-accent/30 hover:border-accent/50 transition-all duration-200">
                      <option value="All Flatbeds">All Flatbeds</option>
                      <option value="All Rolls">All Rolls</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="h-5 w-5 text-accent" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="material-type" className="block text-sm font-medium text-foreground mb-1">Material</label>
                  <div className="relative group">
                    <select id="material-type" value={materialType} onChange={handleMaterialTypeChange} className="w-full rounded-md appearance-none bg-background border border-accent/20 shadow-sm py-2.5 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-accent/30 hover:border-accent/50 transition-all duration-200">
                      <option value="8oz">8oz</option>
                      <option value="C1S">C1S</option>
                      <option value="RTS">RTS</option>
                      <option value="Busmark">Busmark</option>
                      <option value="Lightcal">Lightcal</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="h-5 w-5 text-accent" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="take-to" className="block text-sm font-medium text-foreground mb-1">Take to</label>
                  <div className="relative group">
                    <select
                      id="take-to"
                      value={takeTo}
                      onChange={handleTakeToChange}
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
                  </div>
                </div>
                {/* Print Specs Location only if GF Zund is selected */}
                {takeTo === 'GF Zund' && (
                  <div>
                    <label htmlFor="print-specs-location" className="block text-sm font-medium text-foreground mb-1">Print Specs Location</label>
                    <div className="relative group">
                      <input
                        type="text"
                        id="print-specs-location"
                        value={printSpecsLocation}
                        onChange={handlePrintSpecsLocationChange}
                        className="w-full rounded-md bg-background border border-accent/20 shadow-sm py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-accent/30 hover:border-accent/50 transition-all duration-200"
                        placeholder="Enter Print Specs Location"
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Template 4 fields */}
            {selectedTemplate === 'template4' && (
              <>
                <div>
                  <label htmlFor="job-location" className="block text-sm font-medium text-foreground mb-1">Job Folder Location</label>
                  <div className="relative group">
                    <input type="text" id="job-location" value={jobLocation} onChange={handleJobLocationChange} className="w-full rounded-md bg-background border border-accent/20 shadow-sm py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-accent/30 hover:border-accent/50 transition-all duration-200" placeholder="Enter Job Folder Location" required />
                  </div>
                </div>
                <div>
                  <label htmlFor="approved-device-location" className="block text-sm font-medium text-foreground mb-1">Approved Device Location</label>
                  <div className="relative group">
                    <input type="text" id="approved-device-location" value={approvedDeviceLocation} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setApprovedDeviceLocation(e.target.value)} className="w-full rounded-md bg-background border border-accent/20 shadow-sm py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-accent/30 hover:border-accent/50 transition-all duration-200" placeholder="Enter Approved Device Location" />
                  </div>
                </div>
                <div>
                  <label htmlFor="print-specs-location" className="block text-sm font-medium text-foreground mb-1">Print Specs Location</label>
                  <div className="relative group">
                    <input type="text" id="print-specs-location" value={printSpecsLocation} onChange={handlePrintSpecsLocationChange} className="w-full rounded-md bg-background border border-accent/20 shadow-sm py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-accent/30 hover:border-accent/50 transition-all duration-200" placeholder="Enter Print Specs Location" />
                  </div>
                </div>
                <div>
                  <label htmlFor="email-to" className="block text-sm font-medium text-foreground mb-1">Email Recipients</label>
                  <div className="relative group">
                    <input type="text" id="email-to" value={emailTo} onChange={handleEmailToChange} className="w-full rounded-md bg-background border border-accent/20 shadow-sm py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-accent/30 hover:border-accent/50 transition-all duration-200" placeholder="Enter Email Recipients" />
                  </div>
                </div>
              </>
            )}

            {/* Fallback for other templates (if any) */}
            {selectedTemplate !== 'template1' && selectedTemplate !== 'template2' && selectedTemplate !== 'template3' && selectedTemplate !== 'template4' && (
              <div>Unsupported template</div>
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
              {/* Show the filled template content */}
              {taskList.content && (
                <>
                  <div className="whitespace-pre-line rounded-lg p-4 my-4 bg-zinc-900 text-foreground shadow-[0_0_12px_2px_var(--tw-shadow-color)] shadow-accent/40 border border-accent/20">
                    {taskList.content}
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="px-4 py-2 bg-accent text-accent-foreground text-sm font-medium rounded-md hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent mt-2"
                      onClick={() => handleCopy(taskList.content)}
                    >
                      {copied ? 'Copied!' : 'Copy to Clipboard'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="hidden">No task generated yet</div>
        )}
      </div>
    </div>
  );
} 