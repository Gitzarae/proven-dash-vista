import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Plus, FileText, Download, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface Document {
  id: string;
  title: string;
  description: string;
  file_path: string;
  file_type: string;
  file_size: number;
  version: number;
  uploaded_by: string;
  category: string;
  created_at: string;
}

const Documents = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
    project_id: '',
  });

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error: any) {
      toast.error('Failed to load documents');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!formData.title) {
      toast.error('Please provide a document title');
      return;
    }

    try {
      // In real implementation, this would handle file upload to Supabase Storage
      const { error } = await supabase.from('documents').insert({
        ...formData,
        file_path: '/path/to/file', // Placeholder
        file_type: 'pdf',
        file_size: 0,
        uploaded_by: user?.id,
      });

      if (error) throw error;
      
      toast.success('Document uploaded successfully');
      setDialogOpen(false);
      setFormData({
        title: '',
        description: '',
        category: 'general',
        project_id: '',
      });
      fetchDocuments();
    } catch (error: any) {
      toast.error('Failed to upload document');
      console.error(error);
    }
  };

  const handleDelete = async (documentId: string) => {
    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);

      if (error) throw error;
      
      toast.success('Document deleted');
      fetchDocuments();
    } catch (error: any) {
      toast.error('Failed to delete document');
      console.error(error);
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const stats = {
    total: documents.length,
    thisWeek: documents.filter(d => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(d.created_at) > weekAgo;
    }).length,
    reports: documents.filter(d => d.category === 'report').length,
    evidence: documents.filter(d => d.category === 'evidence').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Document Management</h1>
          <p className="text-muted-foreground mt-1">Upload, organize, and access project documents</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload New Document</DialogTitle>
              <DialogDescription>Add a document to the system</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input 
                placeholder="Document Title" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
              <textarea 
                className="w-full min-h-[100px] px-3 py-2 text-sm rounded-md border border-input bg-background"
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
              <Select value={formData.category} onValueChange={(val) => setFormData({...formData, category: val})}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="report">Report</SelectItem>
                  <SelectItem value="evidence">Evidence</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="specification">Specification</SelectItem>
                </SelectContent>
              </Select>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag and drop files here or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Supported formats: PDF, Images, Videos (Max 50MB)
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleUpload}>Upload</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-hover rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-8 h-8 text-primary" />
            <span className="text-3xl font-bold">{stats.total}</span>
          </div>
          <h3 className="font-semibold">Total Documents</h3>
          <p className="text-sm text-muted-foreground">All files</p>
        </div>
        <div className="glass-hover rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <Plus className="w-8 h-8 text-gra-yellow" />
            <span className="text-3xl font-bold">{stats.thisWeek}</span>
          </div>
          <h3 className="font-semibold">This Week</h3>
          <p className="text-sm text-muted-foreground">Recently added</p>
        </div>
        <div className="glass-hover rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-8 h-8 text-gra-gold" />
            <span className="text-3xl font-bold">{stats.reports}</span>
          </div>
          <h3 className="font-semibold">Reports</h3>
          <p className="text-sm text-muted-foreground">Project reports</p>
        </div>
        <div className="glass-hover rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <Eye className="w-8 h-8 text-gra-navy" />
            <span className="text-3xl font-bold">{stats.evidence}</span>
          </div>
          <h3 className="font-semibold">Evidence</h3>
          <p className="text-sm text-muted-foreground">Photos & videos</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="glass-hover rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background/50"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-48 bg-background/50">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="report">Report</SelectItem>
              <SelectItem value="evidence">Evidence</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="specification">Specification</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Documents List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">Loading documents...</div>
        ) : filteredDocuments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No documents found</div>
        ) : (
          filteredDocuments.map((document) => (
            <div key={document.id} className="glass-hover rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-4 flex-1">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold mb-1 truncate">{document.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{document.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge>{document.category}</Badge>
                      <Badge variant="outline">v{document.version}</Badge>
                      <Badge variant="outline">{formatFileSize(document.file_size)}</Badge>
                      <Badge variant="outline">{new Date(document.created_at).toLocaleDateString()}</Badge>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Eye className="w-4 h-4" />
                  Preview
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="w-4 h-4" />
                  Download
                </Button>
                {(document.uploaded_by === user?.id || user?.role === 'system_admin') && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2 text-destructive"
                    onClick={() => handleDelete(document.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Documents;
