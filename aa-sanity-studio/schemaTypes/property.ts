import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'property',
  title: 'Property',
  type: 'document',
  fields: [
    // Temporary compatibility field to avoid Studio warning for legacy documents
    // Prefer using documentInternationalization (_lang) for language handling
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      readOnly: true,
      hidden: true,
      description: 'Deprecated: use document translations (_lang). Present for legacy docs only.',
    }),
    defineField({
      name: 'propertyId',
      title: 'Property ID',
      type: 'string',
      description: 'Reference to Firebase property ID (read-only)',
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Property Title',
      type: 'string',
      description: 'Property title (read-only from Firebase)',
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'titleTranslation',
      title: 'Title Translation',
      type: 'string',
      description: 'Translated title for this language (editable by admins)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'Property location (read-only from Firebase)',
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'catchphrase',
      title: 'Catchphrase',
      type: 'string',
      description: 'Short, catchy phrase for the property',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'string',
      description: 'Brief description of the property (max 95 characters)',
      validation: (Rule) => Rule.required().max(95),
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'string',
      options: {
        list: [
          {title: 'Yes', value: 'yes'},
          {title: 'No', value: 'no'},
        ],
      },
      initialValue: 'no',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'H4', value: 'h4'},
            {title: 'Quote', value: 'blockquote'},
          ],
          lists: [
            {title: 'Bullet', value: 'bullet'},
            {title: 'Number', value: 'number'},
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
            ],
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url',
                  },
                ],
              },
            ],
          },
        },
      ],
      description: 'Detailed property description',
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
              description: 'Important for SEO and accessibility.',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
          ],
        },
      ],
      description: 'Property images',
    }),
    defineField({
      name: 'highlights',
      title: 'Property Highlights',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              type: 'string',
              title: 'Highlight Title',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'description',
              type: 'text',
              title: 'Description',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'icon',
              type: 'string',
              title: 'Icon Name',
              description: 'Icon name from Lucide React (e.g., "wifi", "car", "bed")',
            },
          ],
        },
      ],
      description: 'Key features and highlights of the property',
    }),
    defineField({
      name: 'amenities',
      title: 'Amenities',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'category',
              type: 'string',
              title: 'Category',
              options: {
                list: [
                  {title: 'General', value: 'general'},
                  {title: 'Kitchen', value: 'kitchen'},
                  {title: 'Bathroom', value: 'bathroom'},
                  {title: 'Bedroom', value: 'bedroom'},
                  {title: 'Outdoor', value: 'outdoor'},
                  {title: 'Entertainment', value: 'entertainment'},
                  {title: 'Safety', value: 'safety'},
                ],
              },
            },
            {
              name: 'name',
              type: 'string',
              title: 'Amenity Name',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'description',
              type: 'text',
              title: 'Description',
            },
          ],
        },
      ],
      description: 'Property amenities and features',
    }),
    defineField({
      name: 'included',
      title: "What's Included",
      type: 'array',
      of: [
        {
          type: 'string',
        },
      ],
      description: 'Items and services included with the property',
    }),
    defineField({
      name: 'notIncluded',
      title: "What's Not Included",
      type: 'array',
      of: [
        {
          type: 'string',
        },
      ],
      description: 'Items and services not included with the property',
    }),
    defineField({
      name: 'houseRules',
      title: 'House Rules',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              type: 'string',
              title: 'Rule Title',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'description',
              type: 'text',
              title: 'Description',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'mandatory',
              type: 'boolean',
              title: 'Mandatory',
              description: 'Is this rule mandatory?',
              initialValue: true,
            },
          ],
        },
      ],
      description: 'Property house rules and policies',
    }),
    defineField({
      name: 'testimonials',
      title: 'Guest Testimonials',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              type: 'string',
              title: 'Guest Name',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'rating',
              type: 'number',
              title: 'Rating',
              validation: (Rule) => Rule.required().min(1).max(5),
            },
            {
              name: 'text',
              type: 'text',
              title: 'Testimonial Text',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'date',
              type: 'date',
              title: 'Date',
              validation: (Rule) => Rule.required(),
            },
          ],
        },
      ],
      description: 'Guest reviews and testimonials',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        {
          name: 'metaTitle',
          type: 'string',
          title: 'Meta Title',
          description: 'Title for search engines (max 60 characters)',
          validation: (Rule) => Rule.max(60),
        },
        {
          name: 'metaDescription',
          type: 'text',
          title: 'Meta Description',
          description: 'Description for search engines (max 160 characters)',
          validation: (Rule) => Rule.max(160),
        },
        {
          name: 'keywords',
          type: 'array',
          title: 'Keywords',
          of: [{type: 'string'}],
          description: 'Keywords for SEO',
        },
      ],
      description: 'SEO optimization fields',
    }),
  ],
  preview: {
    select: {
      title: 'titleTranslation',
      subtitle: 'location',
      media: 'images.0',
    },
    prepare(selection) {
      const {title, subtitle, media} = selection
      return {
        title: title || 'Untitled Property',
        subtitle: subtitle || 'No location',
        media: media,
      }
    },
  },
})
