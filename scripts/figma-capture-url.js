/** Build Figma html-to-design capture URL for a Haven design-capture screen. */
const screens = require('./figma-capture-screens.json');

function buildCaptureUrl(screen, captureId) {
  const endpoint = encodeURIComponent(
    `https://mcp.figma.com/mcp/capture/${captureId}/submit?bindVariables=true`,
  );
  const selector = encodeURIComponent(screens.captureSelector || '#app');
  const q = new URLSearchParams({ nosplash: '1', screen });
  return `${screens.baseUrl}/?${q}#figmacapture=${captureId}&figmaendpoint=${endpoint}&figmadelay=2500&figmaselector=${selector}`;
}

module.exports = { buildCaptureUrl, screens };
