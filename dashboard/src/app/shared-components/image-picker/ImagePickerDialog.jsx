import { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  Box,
  Grid,
  Typography,
  Skeleton,
  Pagination,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Check, Close, CloudUpload, DeleteOutline } from '@mui/icons-material';
import {
  useGetMediaItemsQuery,
  useUploadMediaMutation,
  useDeleteMediaMutation,
} from '../../main/storage/StorageApi';
import ConfirmModal from '../confirm-modal';

function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function ImageCard({ item, currentUrl, onSelect, onDelete }) {
  const isActive = currentUrl === item.url;

  return (
    <Box
      onClick={() => onSelect(item.url)}
      sx={{
        position: 'relative',
        cursor: 'pointer',
        border: isActive ? '2px solid #EB0028' : '2px solid transparent',
        borderRadius: 1,
        overflow: 'hidden',
        aspectRatio: '1',
        bgcolor: '#f5f5f5',
        '&:hover': { borderColor: '#EB0028' },
        '&:hover .delete-btn': { opacity: 1 },
      }}
    >
      <img
        src={item.url}
        alt={item.basename}
        loading="lazy"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />

      <IconButton
        className="delete-btn"
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(item);
        }}
        sx={{
          position: 'absolute',
          top: 4,
          left: 4,
          bgcolor: 'rgba(0,0,0,0.55)',
          opacity: 0,
          transition: 'opacity .15s',
          width: 26,
          height: 26,
          '&:hover': { bgcolor: 'rgba(220,38,38,0.9)' },
        }}
      >
        <DeleteOutline sx={{ color: 'white', fontSize: 15 }} />
      </IconButton>

      {isActive && (
        <Box
          sx={{
            position: 'absolute',
            top: 4,
            right: 4,
            bgcolor: '#EB0028',
            borderRadius: '50%',
            width: 22,
            height: 22,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Check sx={{ color: 'white', fontSize: 14 }} />
        </Box>
      )}

      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: 'rgba(0,0,0,0.55)',
          px: 1,
          py: 0.5,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: 'white',
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {item.basename}
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.65)' }}>
          {formatBytes(item.size)}
        </Typography>
      </Box>
    </Box>
  );
}

function LibraryTab({ currentUrl, onSelect }) {
  const [page, setPage] = useState(1);
  const [confirmItem, setConfirmItem] = useState(null);
  const { data, isLoading, isFetching } = useGetMediaItemsQuery({ page, limit: 20 });
  const [deleteMedia, { isLoading: isDeleting }] = useDeleteMediaMutation();

  const items = data?.data?.items ?? [];
  const totalPages = data?.data?.totalPages ?? 1;

  const handleDeleteConfirm = async () => {
    if (!confirmItem) return;
    await deleteMedia(confirmItem.id);
    if (currentUrl === confirmItem.url) onSelect('');
    setConfirmItem(null);
  };

  if (isLoading) {
    return (
      <Grid container spacing={1.5}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Grid item xs={6} sm={4} md={3} key={i}>
            <Skeleton variant="rectangular" sx={{ aspectRatio: '1', borderRadius: 1 }} />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (!items.length) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography color="text.secondary">No images uploaded yet.</Typography>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ opacity: isFetching ? 0.6 : 1, transition: 'opacity .2s' }}>
        <Grid container spacing={1.5}>
          {items.map((item) => (
            <Grid item xs={6} sm={4} md={3} key={item.id}>
              <ImageCard
                item={item}
                currentUrl={currentUrl}
                onSelect={onSelect}
                onDelete={setConfirmItem}
              />
            </Grid>
          ))}
        </Grid>

        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, val) => setPage(val)}
              sx={{ '& .Mui-selected': { bgcolor: '#EB0028 !important', color: 'white' } }}
            />
          </Box>
        )}
      </Box>

      <ConfirmModal
        open={!!confirmItem}
        onClose={() => setConfirmItem(null)}
        onConfirm={handleDeleteConfirm}
        loading={isDeleting}
        title="Delete Image"
        description={`Are you sure you want to delete "${confirmItem?.basename}"? This action cannot be undone.`}
      />
    </>
  );
}

function UploadTab({ onFileSelect, preview }) {
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const f = e.target.files?.[0];
    if (f) onFileSelect(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f?.type.startsWith('image/')) onFileSelect(f);
  };

  return (
    <Box>
      <Box
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px dashed #ddd',
          borderRadius: 2,
          p: preview ? 2 : 6,
          cursor: 'pointer',
          '&:hover': { borderColor: '#EB0028', bgcolor: '#fff8f8' },
        }}
      >
        <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleChange} />
        {preview ? (
          <img
            src={preview}
            alt="preview"
            style={{
              width: '100%',
              maxHeight: 280,
              objectFit: 'contain',
              borderRadius: 8,
            }}
          />
        ) : (
          <>
            <CloudUpload sx={{ fontSize: 52, color: '#ccc', mb: 1.5 }} />
            <Typography variant="body1" fontWeight={500} color="text.secondary">
              Click or drag an image here
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
              PNG, JPG, WEBP — up to 10 MB
            </Typography>
          </>
        )}
      </Box>
    </Box>
  );
}

export default function ImagePickerDialog({ open, onClose, onSelect, currentUrl = '' }) {
  const [tab, setTab] = useState(0);
  const [pendingFile, setPendingFile] = useState(null);
  const [pendingPreview, setPendingPreview] = useState('');
  const [uploadMedia, { isLoading: isUploading }] = useUploadMediaMutation();

  useEffect(() => {
    if (!open) {
      setPendingFile(null);
      setPendingPreview('');
      setTab(0);
    }
  }, [open]);

  const handleFileSelect = (file) => {
    setPendingFile(file);
    setPendingPreview(URL.createObjectURL(file));
  };

  // Library: clicking an image immediately inserts the URL and closes
  const handleLibrarySelect = (url) => {
    onSelect(url);
    onClose();
  };

  // Upload: triggered by footer button
  const handleUpload = async () => {
    if (!pendingFile) return;
    const formData = new FormData();
    formData.append('file', pendingFile);
    const result = await uploadMedia(formData);
    if (result.data?.data?.url) {
      onSelect(result.data.data.url);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}
      >
        Media Library
        <IconButton onClick={onClose} size="small">
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Box sx={{ px: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            '& .MuiTab-root.Mui-selected': { color: '#EB0028' },
            '& .MuiTabs-indicator': { bgcolor: '#EB0028' },
          }}
        >
          <Tab label="Library" />
          <Tab label="Upload New" />
        </Tabs>
      </Box>

      <DialogContent sx={{ minHeight: 360 }}>
        {tab === 0 && <LibraryTab currentUrl={currentUrl} onSelect={handleLibrarySelect} />}
        {tab === 1 && <UploadTab onFileSelect={handleFileSelect} preview={pendingPreview} />}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: 1, borderColor: 'divider', gap: 1 }}>
        {tab === 1 && pendingFile && (
          <Box sx={{ flex: 1, overflow: 'hidden' }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: 'block',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {pendingFile.name} — {formatBytes(pendingFile.size)}
            </Typography>
          </Box>
        )}
        <Button onClick={onClose} sx={{ flexShrink: 0 }}>
          Cancel
        </Button>
        {tab === 1 && (
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={!pendingFile || isUploading}
            startIcon={isUploading ? <CircularProgress size={14} color="inherit" /> : null}
            sx={{ bgcolor: '#EB0028', '&:hover': { bgcolor: '#c8001f' }, flexShrink: 0 }}
          >
            {isUploading ? 'Uploading…' : 'Upload Image'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
