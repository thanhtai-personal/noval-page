"use client";
import i18n from "@/localization/i18n";
import { makeAutoObservable } from "mobx";

export class LocaleStore {
  language: 'vi' | 'en' = 'vi';

  constructor() {
    makeAutoObservable(this);
  }

  setLanguage(lang: 'vi' | 'en') {
    this.language = lang;
    i18n.locale = lang;
  }

  toggleLanguage() {
    this.setLanguage(this.language === 'vi' ? 'en' : 'vi');
  }
}
