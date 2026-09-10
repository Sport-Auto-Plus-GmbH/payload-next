import type { Field, TextField, TextareaField } from 'payload'

const FONT_SIZE_OPTIONS = [
  { label: 'Klein', value: 'sm' },
  { label: 'Normal', value: 'md' },
  { label: 'Groß', value: 'lg' },
  { label: 'Sehr groß', value: 'xl' },
  { label: 'Riesig', value: '2xl' },
]

/**
 * A text field paired with the font-size/color controls editors get for it.
 * Used three times in heroTeaser (headline/subheadline/description) — extracted
 * here rather than repeated inline. Reuse for any future block that needs the
 * same "editable text with size + color" shape rather than redefining it.
 */
export function styledTextField(
  name: string,
  label: string,
  options?: { required?: boolean; textarea?: boolean },
): Field {
  const textField: TextField | TextareaField = options?.textarea
    ? {
        name: 'text',
        type: 'textarea',
        label: 'Text',
        required: options?.required ?? false,
      }
    : {
        name: 'text',
        type: 'text',
        label: 'Text',
        required: options?.required ?? false,
      }

  return {
    type: 'group',
    name,
    label,
    fields: [
      textField,
      {
        name: 'fontSize',
        type: 'select',
        label: 'Schriftgröße',
        defaultValue: 'md',
        options: FONT_SIZE_OPTIONS,
      },
      {
        name: 'color',
        type: 'text',
        label: 'Farbe (Hex)',
        defaultValue: '#323E48',
        admin: {
          description: 'Hex-Farbwert, z. B. #323E48.',
        },
      },
    ],
  }
}
