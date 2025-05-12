import axios from 'axios';
import { PINATA_API_KEY, PINATA_API_SECRET } from './constants';

// Upload file to IPFS via Pinata
export const uploadFileToIPFS = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const pinataMetadata = JSON.stringify({
    name: file.name,
  });
  formData.append('pinataMetadata', pinataMetadata);

  try {
    const res = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        maxBodyLength: 'Infinity',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_API_SECRET,
        },
      }
    );
    return `ipfs://${res.data.IpfsHash}`;
  } catch (error) {
    console.error('Error uploading file to IPFS: ', error);
    throw error;
  }
};

// Upload JSON metadata to IPFS via Pinata
export const uploadJSONToIPFS = async (jsonData) => {
  try {
    const res = await axios.post(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      jsonData,
      {
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_API_SECRET,
        },
      }
    );
    return `ipfs://${res.data.IpfsHash}`;
  } catch (error) {
    console.error('Error uploading JSON to IPFS: ', error);
    throw error;
  }
};

// Create and upload ticket metadata
export const createTicketMetadata = async (eventId, eventName, imageURI) => {
  const metadata = {
    name: `Ticket for ${eventName}`,
    description: `This ticket grants access to ${eventName}`,
    image: imageURI,
    attributes: [
      {
        trait_type: 'Event ID',
        value: eventId,
      },
      {
        trait_type: 'Event Name',
        value: eventName,
      },
      {
        trait_type: 'Ticket Type',
        value: 'General Admission',
      },
      {
        trait_type: 'Date Created',
        value: new Date().toISOString(),
      },
    ],
  };

  return await uploadJSONToIPFS(metadata);
};

// Convert IPFS URI to HTTP URL for display
export const ipfsToHTTP = (ipfsURI) => {
  if (!ipfsURI) return '';
  if (!ipfsURI.startsWith('ipfs://')) return ipfsURI;
  
  const hash = ipfsURI.replace('ipfs://', '');
  return `https://gateway.pinata.cloud/ipfs/${hash}`;
};
