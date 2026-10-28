import { useState } from "react";
import {
  WhatsappShareButton,
  LinkedinShareButton,
  FacebookShareButton,
  WhatsappIcon,
  LinkedinIcon,
  FacebookIcon
} from "react-share";

const ShareModal = ({ link, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      
      {/* Modal Box */}
      <div onClick={(e) => e.stopPropagation()} className= "bg-white rounded-2xl shadow-xl w-[360px] p-6 relative animate-fadeIn">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-black text-sm"
        >
          ✕
        </button>

        <h3 className="text-lg font-semibold text-[#2a3439] mb-4 text-center">
          Share Document
        </h3>

        {/* Copy Link */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={link}
            readOnly
            className="border border-gray-200 px-3 py-2 rounded-lg w-full text-xs"
          />
          <button
            onClick={handleCopy}
            className="bg-[#5148d7] text-white px-3 rounded-lg text-xs"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        {/* Social Share */}
        <div className="flex justify-center gap-4">
          <WhatsappShareButton url={link}>
            <WhatsappIcon size={40} round />
          </WhatsappShareButton>

          <LinkedinShareButton url={link}>
            <LinkedinIcon size={40} round />
          </LinkedinShareButton>

          <FacebookShareButton url={link}>
            <FacebookIcon size={40} round />
          </FacebookShareButton>
        </div>

      </div>
    </div>
  );
};

export default ShareModal;