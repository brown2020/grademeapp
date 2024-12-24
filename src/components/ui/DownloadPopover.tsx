import { useState } from 'react';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { htmlToDocx } from '@/actions/htmlToDocx';
import { Download } from 'lucide-react';

type DownloadPopoverProps = {
  content: string;
};

const DownloadPopover: React.FC<DownloadPopoverProps> = ({ content }) => {
  const [selectedFormat, setSelectedFormat] = useState<string>('docx');
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let blob;

      if (selectedFormat === 'docx') {
        // Call the server action to generate the .docx file and retrieve the base64 string
        const base64 = await htmlToDocx(content);

        // Decode the base64 string to binary data and create a Blob
        const byteCharacters = atob(base64);
        const byteNumbers = Array.from(byteCharacters).map(char => char.charCodeAt(0));
        const byteArray = new Uint8Array(byteNumbers);
        blob = new Blob([byteArray], {
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        });
      } else {
        // Handle other formats as needed
        blob = new Blob([content], { type: 'text/plain' });
      }

      // Create a URL for the Blob and trigger the download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `document.${selectedFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url); // Clean up
    } catch (error) {
      console.error('Error generating document:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Popover className="relative">
      <PopoverButton className="btn btn-shiny btn-shiny-teal gap-x-2 rounded-full md:rounded-lg size-12 sm:size-16 md:size-fit">
        <Download size={35} />
        <p className="hidden md:flex">Download</p>
      </PopoverButton>

      <PopoverPanel className="absolute z-10 bg-secondary-97 border border-secondary-40 shadow-lg rounded-lg p-4 w-48 mt-2">
        <h3 className="font-semibold text-lg mb-2">Download as</h3>

        <select
          value={selectedFormat}
          onChange={(e) => setSelectedFormat(e.target.value)}
          className="border border-gray-300 rounded w-full p-2 mb-4"
        >
          <option value="docx">DOCX</option>
          {/* <option value="pdf">PDF</option> */}
          {/* <option value="odt">ODT</option> */}
          {/* <option value="rtf">RTF</option> */}
          {/* <option value="txt">TXT</option> */}
        </select>

        <button
          onClick={handleDownload}
          className="bg-secondary-90 border-2 border-primary-40 text-primary-10 font-semibold w-full p-2 rounded-md hover:bg-primary-40 hover:text-secondary"
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Download'}
        </button>
      </PopoverPanel>
    </Popover>
  );
};

export default DownloadPopover;
