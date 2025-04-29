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
  const [selectedTemplate, setSelectedTemplate] = React.useState('template1');
  const [templateContent, setTemplateContent] = React.useState('');
  const [takeTo, setTakeTo] = React.useState('Engineering');
  
  // Form state
  const [jobLocation, setJobLocation] = React.useState("");
  const [dieLocation, setDieLocation] = React.useState("");
  const [dieType, setDieType] = React.useState("All Flatbeds");
  const [artLocation, setArtLocation] = React.useState("");
  const [materialType, setMaterialType] = React.useState("8oz");
  const [renderLocation, setRenderLocation] = React.useState("");
  const [printSpecsLocation, setPrintSpecsLocation] = React.useState("");
  const [emailTo, setEmailTo] = React.useState("");
  const [approvedDeviceLocation, setApprovedDeviceLocation] = React.useState("");
  const [formsCreated, setFormsCreated] = React.useState(false);
  const [screenshots, setScreenshots] = React.useState<File[]>([]);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [processingStatus, setProcessingStatus] = React.useState<string>('');
  
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

  const fetchTemplate = async (templateName: string) => {
    try {
      console.log('Fetching template:', templateName);
      const response = await fetch(`/api/templates?name=${templateName}`);
      if (!response.ok) {
        console.error('Error response from API:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Error details:', errorText);
        return;
      }
      const data = await response.json();
      if (data.content) {
        console.log('Template loaded successfully:', templateName);
        console.log('Template content:', data.content);
        setTemplateContent(data.content);
      } else {
        console.error('Template content is empty:', templateName);
      }
    } catch (error) {
      console.error('Error fetching template:', error);
    }
  };

  // Fetch template content when template is selected
  React.useEffect(() => {
    fetchTemplate(selectedTemplate);
  }, [selectedTemplate]);

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTemplate = e.target.value;
    console.log('Template changed to:', newTemplate);
    setSelectedTemplate(newTemplate);
    // Clear the task list when template changes
    setTaskList(null);
    // Reset forms created state and screenshots when switching away from template 4
    if (newTemplate !== 'template4') {
      setFormsCreated(false);
      setScreenshots([]);
      setProcessingStatus('');
    }
    // If template 3 is selected, we'll load the appropriate variant based on takeTo
    if (newTemplate === 'template3') {
      // Format the variant name to match the file name
      const variant = takeTo === 'GF Zund' ? 'gfzund' : 'engineering';
      console.log('Loading template 3 variant:', variant);
      fetchTemplate(`template3-${variant}`);
    } else {
      fetchTemplate(newTemplate);
    }
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
    const newTakeTo = e.target.value;
    console.log('Take to changed to:', newTakeTo);
    setTakeTo(newTakeTo);
    // If template 3 is selected, reload the template with the new takeTo value
    if (selectedTemplate === 'template3') {
      // Format the variant name to match the file name
      const variant = newTakeTo === 'GF Zund' ? 'gfzund' : 'engineering';
      console.log('Loading template 3 variant for takeTo change:', variant);
      fetchTemplate(`template3-${variant}`);
    }
  };

  const handlePrintSpecsLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrintSpecsLocation(e.target.value);
  };

  const handleEmailToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailTo(e.target.value);
  };

  const handleFormsCreatedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormsCreated(e.target.checked);
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setScreenshots((prev: File[]) => [...prev, ...newFiles]);
    }
  };

  const removeScreenshot = (index: number) => {
    setScreenshots((prev: File[]) => prev.filter((_: File, i: number) => i !== index));
  };

  const handleGenerateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let extractedDataText = '';
    
    // Process screenshots if forms are created and screenshots are uploaded
    if (formsCreated && screenshots.length > 0) {
      try {
        setIsProcessing(true);
        setProcessingStatus(`Processing ${screenshots.length} screenshot(s) with ChatGPT...`);
        
        // Process each screenshot with ChatGPT
        const processedResults = [];
        
        for (let i = 0; i < screenshots.length; i++) {
          const screenshot = screenshots[i];
          setProcessingStatus(`Processing screenshot ${i + 1} of ${screenshots.length} with ChatGPT...`);
          
          const formData = new FormData();
          formData.append('file', screenshot);
          
          const response = await fetch('/api/process-image', {
            method: 'POST',
            body: formData,
          });
          
          const result = await response.json();
          
          if (!response.ok) {
            throw new Error(result.error || 'Failed to process screenshot with ChatGPT');
          }
          
          if (!result.data) {
            throw new Error('No data returned from ChatGPT processing');
          }
          
          processedResults.push(result.data);
        }
        
        setProcessingStatus(`Successfully processed ${screenshots.length} screenshot(s) with ChatGPT`);
        console.log('Processed data from ChatGPT:', processedResults);
        
        // Format the extracted data for the task
        if (processedResults.length > 0) {
          // Combine all processed results
          processedResults.forEach((result, index) => {
            if (index > 0) {
              extractedDataText += '\n';
            }
            extractedDataText += result;
          });
        }
      } catch (error) {
        console.error('Error processing screenshots with ChatGPT:', error);
        
        let errorMessage = 'Error processing screenshots with ChatGPT. Please try again.';
        
        if (error instanceof Error) {
          errorMessage = `Error: ${error.message}`;
          
          // Check for specific error types
          if (errorMessage.includes('API key')) {
            errorMessage = 'OpenAI API key is not configured. Please check your environment variables.';
          } else if (errorMessage.includes('rate limit')) {
            errorMessage = 'OpenAI API rate limit exceeded. Please try again later.';
          }
        }
        
        setProcessingStatus(errorMessage);
        extractedDataText = `\n\nERROR: ${errorMessage}\n`;
      } finally {
        setIsProcessing(false);
      }
    }
    
    // Continue with the existing task generation logic
    if (!jobLocation) {
      alert("Job location is required");
      return;
    }

    // Create a new task list
    const newTaskList: TaskList = {
      id: generateUniqueId(),
      title: "Task " + new Date().toLocaleDateString(),
      files: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      version: taskList ? taskList.version + 1 : 1,
      templateId: selectedTemplate,
      content: templateContent
    };

    // Replace placeholders in the template content
    let content = templateContent;
    
    // Replace placeholders based on the selected template
    if (selectedTemplate === 'template1') {
      content = content
        .replace(/\[Enter Job Folder Location\]/g, jobLocation)
        .replace(/\[Enter Die Location\]/g, dieLocation)
        .replace(/\[Enter High-Res Art Location\]/g, artLocation)
        .replace(/\[Enter Render Location\]/g, renderLocation)
        .replace(/\[Enter Email Recipients\]/g, emailTo);
    } else if (selectedTemplate === 'template2') {
      content = content
        .replace(/\[Enter Job Folder Location\]/g, jobLocation)
        .replace(/\[Enter Die Location\]/g, dieLocation)
        .replace(/\[Enter High-Res Art Location\]/g, artLocation)
        .replace(/\[Enter Render Location\]/g, renderLocation)
        .replace(/\[Enter Email Recipients\]/g, emailTo);
    } else if (selectedTemplate === 'template3') {
      console.log('Template 3 content before replacement:', content);
      console.log('Material type:', materialType);
      
      content = content
        .replace(/\[Enter Job Folder Location\]/g, jobLocation)
        .replace(/\[All Flatbeds \/ All Rolls\]/g, dieType)
        .replace(/Material: \[8oz \/ C1S \/ RTS \/ Busmark \/ Lightcal \/ Other\]/g, `Material: ${materialType}`)
        .replace(/\[Print Specs Location\]/g, printSpecsLocation);
      
      console.log('Template 3 content after replacement:', content);
      
      // Add conditional line for All Flatbeds
      if (dieType === 'All Flatbeds') {
        content = content.replace(
          /- Check to make sure the color space is correct/g,
          '- Check to make sure the color space is correct\n - CROP THE PDFs TO FIT THE MATERIAL'
        );
      }
    } else if (selectedTemplate === 'template4') {
      content = content
        .replace(/\[Enter Job Folder Location\]/g, jobLocation)
        .replace(/\[Approved Device Location\]/g, artLocation)
        .replace(/\[Print Specs Location\]/g, renderLocation)
        .replace(/\[Enter Email Recipients\]/g, emailTo);
    }
    
    // Add the extracted data to the content if available
    if (extractedDataText) {
      // Replace "GF Imposition (LA):" with "GF Print:" and "Zund Cut:" with "GF Cut:" in the extracted data
      const modifiedDataText = extractedDataText
        .replace(/GF Imposition \(LA\):/g, 'GF Print:')
        .replace(/Zund Cut:/g, 'GF Cut:');
      
      // Process the modified data to only include GF Print section with actual data
      let processedDataText = '';
      
      // Check for GF Print section
      const gfPrintMatch = modifiedDataText.match(/GF Print:([\s\S]*?)(?=GF Cut:|$)/);
      if (gfPrintMatch && gfPrintMatch[1].trim() && 
          !gfPrintMatch[1].includes('(No matching rows found)') && 
          !gfPrintMatch[1].includes('(No entries found)') &&
          !gfPrintMatch[1].includes('There are no matches for') &&
          !gfPrintMatch[1].includes('(No matching data for this section)')) {
        processedDataText += 'GF Print:' + gfPrintMatch[1];
      }
      
      // Only add the processed data if it contains actual content
      if (processedDataText.trim()) {
        // Find the position of "FORMS:" in the content
        const formsIndex = content.indexOf('FORMS:');
        if (formsIndex !== -1) {
          // For template 4, ensure "GF Print:" appears directly after "FORMS:"
          if (selectedTemplate === 'template4') {
            // Check if the processed data contains "GF Print:"
            const gfPrintIndex = processedDataText.indexOf('GF Print:');
            if (gfPrintIndex !== -1) {
              // Extract the GF Print section
              const gfPrintSection = processedDataText.substring(gfPrintIndex);
              // Insert the GF Print section directly after "FORMS:"
              content = content.substring(0, formsIndex + 6) + '\n' + gfPrintSection + content.substring(formsIndex + 6);
            } else {
              // If no GF Print section, just insert the data as is
              content = content.substring(0, formsIndex + 6) + processedDataText + content.substring(formsIndex + 6);
            }
          } else {
            // For other templates, insert the processed data as is
            content = content.substring(0, formsIndex + 6) + processedDataText + content.substring(formsIndex + 6);
          }
        } else {
          // If "FORMS:" is not found, append the processed data at the end
          content += processedDataText;
        }
      }
    }
    
    newTaskList.content = content;
    setTaskList(newTaskList);
    setCopied(false);
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
            
            {/* Forms created checkbox - only shown for template 4 */}
            {selectedTemplate === 'template4' && (
              <div className="flex items-center mt-4">
                <input 
                  type="checkbox" 
                  id="forms-created" 
                  checked={formsCreated} 
                  onChange={handleFormsCreatedChange} 
                  className="h-4 w-4 text-accent focus:ring-accent border-accent/20 rounded"
                />
                <label htmlFor="forms-created" className="ml-2 block text-sm font-medium text-foreground">
                  Have forms been created?
                </label>
              </div>
            )}
            
            {formsCreated && selectedTemplate === 'template4' && (
              <div className="mt-4 p-4 border border-accent/20 rounded-md bg-background/50">
                <h3 className="text-lg font-medium mb-2">Upload Screenshots for Data Extraction</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Upload screenshots of your forms to extract data automatically.
                </p>
                
                <div className="mb-3">
                  <label htmlFor="screenshots" className="block text-sm font-medium text-foreground mb-1">
                    Select Screenshots
                  </label>
                  <input
                    type="file"
                    id="screenshots"
                    multiple
                    accept="image/*"
                    onChange={handleScreenshotChange}
                    disabled={isProcessing}
                    className="w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-accent/10 file:text-accent hover:file:bg-accent/20 disabled:opacity-50"
                  />
                </div>
                
                {isProcessing && (
                  <div className="mt-3 p-3 bg-accent/10 rounded-md">
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-sm font-medium">{processingStatus}</span>
                    </div>
                  </div>
                )}
                
                {!isProcessing && processingStatus && (
                  <div className="mt-3 p-3 bg-green-50 text-green-800 rounded-md">
                    <p className="text-sm">{processingStatus}</p>
                  </div>
                )}
                
                {screenshots.length > 0 && (
                  <div className="mt-3">
                    <h4 className="text-sm font-medium mb-2">Selected Screenshots:</h4>
                    <ul className="space-y-2">
                      {screenshots.map((file: File, index: number) => (
                        <li key={index} className="flex items-center justify-between p-2 bg-background rounded border border-accent/10">
                          <span className="text-sm truncate max-w-[80%]">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeScreenshot(index)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
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