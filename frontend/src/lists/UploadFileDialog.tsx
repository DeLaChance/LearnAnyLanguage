import { DropzoneDialog } from 'material-ui-dropzone';
import React from 'react';
 
export type Props = {
    open: boolean;
    handleClose: () => void;
    handleSave: (file: File) => void;
};

export default function UploadFileDialog(props: Props) {
 
    const handleSave = (files: File[]) => {
        if (files.length > 0) {
            props.handleSave(files[0]);        
        }
    }
      
    return (
        <div>
            <DropzoneDialog
                open={props.open}
                onSave={handleSave}
                acceptedFiles={['.lst']}
                showPreviews={true}
                maxFileSize={5000000}
                onClose={props.handleClose}
            />
        </div>
    );
    
}