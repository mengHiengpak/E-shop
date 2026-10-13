import type { Language } from '../hook/LanguageContext'

// The backend only stores a single (English) category name, so Khmer labels are
// mapped here by the English name. Unknown names fall back to the original.
const KHMER_CATEGORY_NAMES: Record<string, string> = {
  'rice & grains': 'អង្ករ និងធញ្ញជាតិ',
  'organic & local herbs': 'សរីរាង្គ និងឱសថក្នុងស្រុក',
  'local cooking pastes': 'គ្រឿងបុក និងគ្រឿងផ្សំក្នុងស្រុក',
  'noodles & instant food': 'មី និងអាហារសម្រេច',
  'cooking oils & condiments': 'ប្រេងឆា និងគ្រឿងបរិភោគ',
  'snacks & sweets': 'អាហារសម្រន់ និងនំផ្អែម',
  'bottled water & soft drinks': 'ទឹកសុទ្ធ និងភេសជ្ជៈ',
  'local beers & spirits': 'ស្រាបៀរ និងស្រាក្នុងស្រុក',
  'coffee & tea': 'កាហ្វេ និងតែ',
  'skincare & sun protection': 'ថែរស្បែក និងការពារកម្តៅថ្ងៃ',
  'hair & body wash': 'សាប៊ូកក់សក់ និងដុសខ្លួន',
  'oral & personal care': 'ថែរមាត់ និងខ្លួនប្រាណ',
  'baby diapers': 'កន្ទបទារក',
  'baby food & wipes': 'អាហារទារក និងក្រដាសជូត',
  'laundry & cleaning': 'សាប៊ូបោកខោអាវ និងសម្អាត',
  'paper goods': 'ផលិតផលក្រដាស',
  'portable audio': 'ឧបករណ៍សំឡេងចល័ត',
  'power & charging': 'ថាមពល និងការសាកថ្ម',
}

export function localizeCategory(
  name: string | null | undefined,
  language: Language
): string {
  const value = (name ?? '').trim()
  if (!value || language !== 'kh') return value
  return KHMER_CATEGORY_NAMES[value.toLowerCase()] ?? value
}
