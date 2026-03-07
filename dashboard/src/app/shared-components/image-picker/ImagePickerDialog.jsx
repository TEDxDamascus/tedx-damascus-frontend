import { useState, useEffect, useRef } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Tabs, Tab, Box, Grid, Typography,
  Skeleton, Pagination, IconButton, CircularProgress
} from '@mui/material';
import { Check, Close, CloudUpload } from '@mui/icons-material';
import { useGetMediaItemsQuery, useUploadMediaMutation } from '../../main/storage/StorageApi';

function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function ImageCard({ item, selected, onSelect }) {
  return (
    <Box
      onClick={() => onSelect(selected ? '' : item.url)}
      sx={{
        position: 'relative',
        cursor: 'pointer',
        border: selected ? '2px solid #EB0028' : '2px solid transparent',
        borderRadius: 1,
        overflow: 'hidden',
        aspectRatio: '1',
        bgcolor: '#f5f5f5',
        '&:hover': { borderColor: '#EB0028' }
      }}
    >
      <img
        src={item.url}
        alt={item.basename}
        loading="lazy"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
      {selected && (
        <Box sx={{
          position: 'absolute', top: 6, right: 6,
          bgcolor: '#EB0028', borderRadius: '50%',
          width: 22, height: 22,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Check sx={{ color: 'white', fontSize: 14 }} />
        </Box>
      )}
      <Box sx={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        bgcolor: 'rgba(0,0,0,0.55)', px: 1, py: 0.5
      }}>
        <Typography variant="caption" sx={{
          color: 'white', display: 'block',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
        }}>
          {item.basename}
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.65)' }}>
          {formatBytes(item.size)}
        </Typography>
      </Box>
    </Box>
  );
}

function LibraryTab({ selectedUrl, onSelect }) {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching } = useGetMediaItemsQuery({ page, limit: 20 });

  const items = data?.data?.items ?? [];
  const totalPages = data?.data?.totalPages ?? 1;

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
    <Box sx={{ opacity: isFetching ? 0.6 : 1, transition: 'opacity .2s' }}>
      <Grid container spacing={1.5}>
        {items.map((item) => (
          <Grid item xs={6} sm={4} md={3} key={item.id}>
            <ImageCard
              item={item}
              selected={selectedUrl === item.url}
              onSelect={onSelect}
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
  );
}

function UploadTab({ onUploaded }) {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [uploadMedia, { isLoading }] = useUploadMediaMutation();

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    const result = await uploadMedia(formData);
    if (result.data?.data?.url) {
      onUploaded(result.data.data.url);
    }
  };

  return (
    <Box>
      <Box
        onClick={() => fileInputRef.current?.click()}
        sx={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', border: '2px dashed #ddd', borderRadius: 2,
          p: 5, cursor: 'pointer', mb: 2,
          '&:hover': { borderColor: '#EB0028', bgcolor: '#fff8f8' }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleFileChange}
        />
        <CloudUpload sx={{ fontSize: 44, color: '#bbb', mb: 1 }} />
        <Typography variant="body2" color="text.secondary">Click to select an image</Typography>
        <Typography variant="caption" color="text.secondary">PNG, JPG, WEBP — up to 10 MB</Typography>
      </Box>

      {preview && (
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          <img
            src={preview}
            alt="preview"
            style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" fontWeight={500}>{file?.name}</Typography>
            <Typography variant="caption" color="text.secondary">{formatBytes(file?.size ?? 0)}</Typography>
            <Button
              variant="contained"
              size="small"
              onClick={handleUpload}
              disabled={isLoading}
              sx={{ mt: 1.5, display: 'flex', bgcolor: '#EB0028', '&:hover': { bgcolor: '#c8001f' } }}
              startIcon={isLoading ? <CircularProgress size={14} color="inherit" /> : null}
            >
              {isLoading ? 'Uploading…' : 'Upload'}
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default function ImagePickerDialog({ open, onClose, onSelect, currentUrl = '' }) {
  const [tab, setTab] = useState(0);
  const [selectedUrl, setSelectedUrl] = useState(currentUrl);

  useEffect(() => {
    if (open) {
      setSelectedUrl(currentUrl);
      setTab(0);
    }
  }, [open, currentUrl]);

  const handleConfirm = () => {
    onSelect(selectedUrl);
    onClose();
  };

  const handleUploaded = (url) => {
    setSelectedUrl(url);
    setTab(0);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
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
            '& .MuiTabs-indicator': { bgcolor: '#EB0028' }
          }}
        >
          <Tab label="Library" />
          <Tab label="Upload New" />
        </Tabs>
      </Box>

      <DialogContent sx={{ minHeight: 360 }}>
        {tab === 0 && (
          <LibraryTab selectedUrl={selectedUrl} onSelect={setSelectedUrl} />
        )}
        {tab === 1 && (
          <UploadTab onUploaded={handleUploaded} />
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: 1, borderColor: 'divider', gap: 1 }}>
        {selectedUrl && (
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1, overflow: 'hidden' }}>
            <img
              src={selectedUrl}
              alt=""
              style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {selectedUrl}
            </Typography>
          </Box>
        )}
        <Button onClick={onClose} sx={{ flexShrink: 0 }}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={!selectedUrl}
          sx={{ bgcolor: '#EB0028', '&:hover': { bgcolor: '#c8001f' }, flexShrink: 0 }}
        >
          Select Image
        </Button>
      </DialogActions>
    </Dialog>
  );
}
