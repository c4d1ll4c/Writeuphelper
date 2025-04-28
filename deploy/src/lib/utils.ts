import { type ClassValue } from "clsx"
import clsx from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface FileItem {
  id: string
  fileName: string
  fileLocation: string
  description?: string
  specifications?: string
  completed: boolean
}

export interface TaskList {
  id: string
  title: string
  description?: string
  files: FileItem[]
  createdAt: Date
  updatedAt: Date
  version: number
  templateId?: string
}

export function generateUniqueId(): string {
  return Math.random().toString(36).substring(2, 9)
}

export function generateTextFormat(taskList: TaskList): string {
  // Get file locations from the saved files
  const jobFolderLocation = taskList.files.find(f => f.fileName === "Job Folder")?.fileLocation || "";
  const dieLocation = taskList.files.find(f => f.fileName === "Die File")?.fileLocation || "";
  const artLocation = taskList.files.find(f => f.fileName === "Art File")?.fileLocation || "";
  const renderLocation = taskList.files.find(f => f.fileName === "Render")?.fileLocation || "";
  const emailTo = taskList.files.find(f => f.fileName === "Email Contact")?.fileLocation || "";
  const printSpecsLocation = taskList.files.find(f => f.fileName === "Print Specs")?.fileLocation || "";
  
  // For specialty-final-production template
  const approvedDeviceCap = taskList.files.find(f => f.fileName === "- Approved Device Cap #")?.fileLocation || "";
  const printSpecsLoc = taskList.files.find(f => f.fileName === "- Print Specs Location")?.fileLocation || "";
  const emailRecipients = taskList.files.find(f => f.fileName === "4. Email GF Planning, Structural Design")?.fileLocation || "";
  
  // Get the template ID, default to specialty-initial if not set
  const templateId = taskList.templateId || 'specialty-initial';
  
  // Create the formatted text based on the template
  if (templateId === 'specialty-initial') {
    return `${jobFolderLocation}

Color Composite Initial Setup
1. Pick up and process the dies sent by Engineering.
 - Location: ${dieLocation}
2. Build the art supplied by Premedia into the dies.
 - Location: ${artLocation}
3. Use the approved render as your FPO.
 - Location: ${renderLocation}
4. Send out PDFs with the dies burned in for approval.
 - Email to: ${emailTo}
5. Export and setup all the dies for Zund cutting.`;
  } else if (templateId === 'specialty-presslay') {
    return `${jobFolderLocation}

Presslay Setup
1. Pick up and process the presslay dies sent by Engineering.
 - Location: ${dieLocation}
2. Build the device color approved art supplied by Premedia into the dies.
 - Location: ${artLocation}
3. Use the approved render as your FPO.
 - Location: ${renderLocation}
4. Send out PDFs with the dies burned in for approval.
 - Email to: ${emailTo}
5. Export and setup all the dies for Zund cutting.`;
  } else if (templateId === 'specialty-gf-device') {
    // Base template for GF Device
    if (renderLocation === 'Engineering') {
      return `${jobFolderLocation}

AFTER PDF APPROVAL:
1. Save out PDF(s) without dies.
 - Check to make sure the color space is correct${dieLocation === 'All Flatbeds' ? '\n - CROP THE PDFS' : ''}
2. Send to GF Device.
 - ${dieLocation}
 - Material: ${artLocation}
 - Special Instructions: Take to Engineering
3. Email the dies to Engineering.`;
    } else if (renderLocation === 'GF Zund') {
      if (printSpecsLocation) {
        return `${jobFolderLocation}

AFTER PDF APPROVAL:
1. Save out PDF(s) without dies.
 - Check to make sure the color space is correct${dieLocation === 'All Flatbeds' ? '\n - CROP THE PDFS' : ''}
2. Send to GF Device.
 - ${dieLocation}
 - Material: ${artLocation}
 - Special Instructions: Take to the Zund. See Zund hotfolder for the mounting specs PDF.
3. Copy the dies and the PrintSpecs.PDF to the Zund hotfolder for GF to mount and cut.
 - Print Specs Location: ${printSpecsLocation}`;
      } else {
        return `${jobFolderLocation}

AFTER PDF APPROVAL:
1. Save out PDF(s) without dies.
 - Check to make sure the color space is correct${dieLocation === 'All Flatbeds' ? '\n - CROP THE PDFS' : ''}
2. Send to GF Device.
 - ${dieLocation}
 - Material: ${artLocation}
 - Special Instructions: Take to the Zund. See Zund hotfolder for the mounting specs PDF.
3. Copy the dies and the PrintSpecs.PDF to the Zund hotfolder for GF to mount and cut.`;
      }
    }
    
    // Default case (shouldn't reach here, but just in case)
    return `Job Folder Location:
${jobFolderLocation}

Specialty - GF Device
1. Pick up and process the dies sent by Engineering.
 - Location: ${dieLocation}
2. Material to use:
 - ${artLocation}
3. Take to:
 - ${renderLocation}`;
  } else if (templateId === 'specialty-final-production') {
    return `${jobFolderLocation}

AFTER PDF APPROVAL:
1. Save out PDFs for FINAL PRODUCTION.
 - CROP THE PDFS IF NEEDED
2. Copy the dies to the Zund hotfolder.
3. Send the approved presslays to GF Final Production.
- Approved Device Cap #: ${approvedDeviceCap}
- Email PDFs and PrintSpecs PDF can be found in the job folder.
- Print Specs Location: ${printSpecsLoc}
4. Email GF Planning, Structural Design & ${emailRecipients}
5. Task Complete in Monarch

FORMS:`;
  } else {
    // Default template for other templates
    return `Job Folder Location:
${jobFolderLocation}


1. Pick up and process the dies sent by Engineering.
 - Location: ${dieLocation}
2. Build the art supplied by Premedia into the dies.
 - Location: ${artLocation}
3. Use the approved render as your FPO.
 - Location: ${renderLocation}
4. Send out PDFs with the dies burned in for approval.
 - Email to: ${emailTo}`;
  }
}

export function copyToClipboard(text: string): Promise<boolean> {
  try {
    return navigator.clipboard.writeText(text)
      .then(() => true)
      .catch(() => false);
  } catch (err) {
    return Promise.resolve(false);
  }
}
