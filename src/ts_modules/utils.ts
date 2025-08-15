export const sanitiseInput = (input: string): string => {
  return input
    .trim()
    .replace(/\s+/g, " ")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
};

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const displayMessageOnSubmit = async (
  formEl: HTMLFormElement,
  error: HTMLParagraphElement,
  message: string
) => {
  formEl.style.display = "none";
  error.textContent = message;
  await sleep(50);
  error.style.opacity = "1";
  await sleep(5000);
  error.style.opacity = "0";
  await sleep(100);
  error.textContent = "";
  formEl.style.display = "flex";
};
