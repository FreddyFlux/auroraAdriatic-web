import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  fields: [
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'home',
      title: 'Home',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'about',
      title: 'About',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'contact',
      title: 'Contact',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'home',
      subtitle: 'language',
    },
    prepare(selection) {
      const {title, subtitle} = selection
      return {
        title: title || 'Navigation',
        subtitle: `Language: ${subtitle?.toUpperCase()}`,
      }
    },
  },
})
