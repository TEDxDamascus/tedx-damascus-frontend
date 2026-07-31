export interface TeamMemberMeta {
  slug: string;
  photo: string;
}

// Order matches the "Our Team" grid in the Figma design (node 2001-1354).
// Localized name/role/category/bio copy lives in messages/{locale}.json under Team.mN* / TeamMember.mN*.
export const TEAM_MEMBERS: TeamMemberMeta[] = [
  { slug: 'omar-al-khatib', photo: '/images/team/omar-al-khatib.jpg' },
  { slug: 'lina-safadi', photo: '/images/team/lina-safadi.jpg' },
  { slug: 'samer-hamwi', photo: '/images/team/samer-hamwi.jpg' },
  { slug: 'dina-al-homsi', photo: '/images/team/dina-al-homsi.jpg' },
  { slug: 'zaid-murad', photo: '/images/team/zaid-murad.jpg' },
  { slug: 'hani-jaber', photo: '/images/team/hani-jaber.jpg' },
  { slug: 'maya-kassem', photo: '/images/team/maya-kassem.jpg' },
  { slug: 'fadi-mansour', photo: '/images/team/fadi-mansour.jpg' },
];

export const TEAM_SLUGS = TEAM_MEMBERS.map((m) => m.slug);
