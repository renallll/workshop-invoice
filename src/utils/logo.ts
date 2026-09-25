const LOGO_STORAGE_KEY = "workshop_logo";

export const getLogo = (): string | null =>
  localStorage.getItem(LOGO_STORAGE_KEY);

export const saveLogo = (logo: string): void => {
  localStorage.setItem(LOGO_STORAGE_KEY, logo);
};

export const clearLogo = (): void => {
  localStorage.removeItem(LOGO_STORAGE_KEY);
};
