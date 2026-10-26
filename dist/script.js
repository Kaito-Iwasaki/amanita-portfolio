document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('copy-discord').addEventListener('click', async () => {
  const status = document.getElementById('copy-status');
  try { await navigator.clipboard.writeText('kinoko1241'); status.textContent = 'Discordユーザー名をコピーしました。'; }
  catch { status.textContent = 'コピーできませんでした。ユーザー名: kinoko1241'; }
});