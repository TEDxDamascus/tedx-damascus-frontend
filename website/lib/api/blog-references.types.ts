export interface BlogReference {
  _id: string;
  blog_id: string;
  name: string;
  desc: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogReferencesResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: BlogReference[];
}
