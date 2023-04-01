
document.getElementById('replaceAvatar').addEventListener('click', async () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.click();

  input.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = async () => {
      const imageUrl = reader.result;
      console.log('Base64 Image:', imageUrl);

      // 保存用户选择的头像 URL
      chrome.storage.local.set({ 'savedAvatarUrl': imageUrl });

      // 向 content.js 发送消息
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      chrome.tabs.sendMessage(tab.id, { type: 'changeAvatar', imageUrl });
    };

    reader.readAsDataURL(file);
  });
});

document.getElementById('avatarSize').addEventListener('input', (event) => {
  const newSize = event.target.value;
  chrome.storage.local.set({ savedAvatarSize: newSize }, () => {
    console.log('Saved avatar size:', newSize);
  });
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: 'changeAvatarSize', size: newSize });
  });
});

function updateUI() {
  chrome.storage.local.get('savedAvatarSize', (data) => {
    const savedAvatarSize = data.savedAvatarSize || 72; // 设置默认值
    document.getElementById('avatarSize').value = savedAvatarSize;
  });
}
document.addEventListener('DOMContentLoaded', updateUI);


console.log('Popup script loaded');
