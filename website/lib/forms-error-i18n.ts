// Forms are Arabic-only (see app/[locale]/forms redirects), so backend
// submission errors — plain English strings — are translated here before
// being shown to the user.
export function translateApiError(msg: string): string {
  const l = msg.toLowerCase();
  if (l.includes('closed') || l.includes('window')) return 'عذراً، لقد تم إغلاق استقبال الطلبات لهذا النموذج.';
  if (l.includes('phone')) return 'رقم الهاتف غير صالح. يرجى إدخال رقم سوري صحيح (9 أو 10 أرقام بعد +963)';
  if (l.includes('email') && (l.includes('already') || l.includes('exist') || l.includes('duplicate'))) return 'البريد الإلكتروني مُستخدم بالفعل';
  if (l.includes('email')) return 'البريد الإلكتروني غير صالح';
  if (l.includes('required')) return 'يرجى تعبئة جميع الحقول المطلوبة';
  if (l.includes('network') || l.includes('fetch') || l.includes('connect')) return 'خطأ في الاتصال. يرجى المحاولة مجدداً';
  if (l.includes('already') || l.includes('exist') || l.includes('duplicate')) return 'هذه البيانات مسجّلة بالفعل';
  return 'حدث خطأ أثناء الإرسال. يرجى المحاولة مجدداً';
}
