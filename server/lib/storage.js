const { supabase } = require('./supabase');

const BUCKET_NAME = 'will-documents';

async function ensureBucketExists() {
  try {
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      throw listError;
    }
    
    const bucketExists = buckets.some(bucket => bucket.name === BUCKET_NAME);
    
    if (!bucketExists) {
      console.log(`Creating storage bucket: ${BUCKET_NAME}`);
      const { data, error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: false,
        fileSizeLimit: 10485760 // 10MB limit
      });
      
      if (createError) {
        console.error('Error creating bucket:', createError);
        throw createError;
      }
      
      console.log(`Bucket ${BUCKET_NAME} created successfully`);
    } else {
      console.log(`Bucket ${BUCKET_NAME} already exists`);
    }
    
    return true;
  } catch (error) {
    console.error('Error ensuring bucket exists:', error);
    throw error;
  }
}

async function uploadPDF(buffer, filePath) {
  try {
    await ensureBucketExists();
    
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, buffer, {
        contentType: 'application/pdf',
        upsert: true
      });
    
    if (error) {
      console.error('Error uploading PDF:', error);
      throw error;
    }
    
    return filePath;
  } catch (error) {
    console.error('Error in uploadPDF:', error);
    throw error;
  }
}

async function getSignedUrl(filePath, expiresIn = 3600) {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(filePath, expiresIn);
    
    if (error) {
      console.error('Error creating signed URL:', error);
      throw error;
    }
    
    return data.signedUrl;
  } catch (error) {
    console.error('Error in getSignedUrl:', error);
    throw error;
  }
}

async function deletePDF(filePath) {
  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);
    
    if (error) {
      console.error('Error deleting PDF:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deletePDF:', error);
    throw error;
  }
}

async function deleteAllUserFiles(userId) {
  try {
    const { data: files, error: listError } = await supabase.storage
      .from(BUCKET_NAME)
      .list(userId);
    
    if (listError) {
      console.error('Error listing user files:', listError);
      throw listError;
    }
    
    if (!files || files.length === 0) {
      console.log(`No files found for user ${userId}`);
      return true;
    }
    
    const filePaths = [];
    for (const file of files) {
      const { data: subFiles, error: subListError } = await supabase.storage
        .from(BUCKET_NAME)
        .list(`${userId}/${file.name}`);
      
      if (subListError) {
        console.error('Error listing subfolder files:', subListError);
        continue;
      }
      
      if (subFiles) {
        subFiles.forEach(subFile => {
          filePaths.push(`${userId}/${file.name}/${subFile.name}`);
        });
      }
    }
    
    if (filePaths.length > 0) {
      console.log(`Deleting ${filePaths.length} files for user ${userId}`);
      const { error: deleteError } = await supabase.storage
        .from(BUCKET_NAME)
        .remove(filePaths);
      
      if (deleteError) {
        console.error('Error deleting user files:', deleteError);
        throw deleteError;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteAllUserFiles:', error);
    throw error;
  }
}

module.exports = {
  ensureBucketExists,
  uploadPDF,
  getSignedUrl,
  deletePDF,
  deleteAllUserFiles,
  BUCKET_NAME
};
