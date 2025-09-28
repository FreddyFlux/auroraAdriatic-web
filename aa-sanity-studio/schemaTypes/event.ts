import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({
      name: 'eventId',
      title: 'Event ID',
      type: 'string',
      description: 'Reference to Firebase event ID (read-only)',
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Event Title',
      type: 'string',
      description: 'Event title (read-only from Firebase)',
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'Event location (read-only from Firebase)',
      readOnly: true,
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
            {title: 'H1', value: 'h1'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
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
      description: 'Rich text description of the event',
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
      description: 'Event images and photos',
    }),
    defineField({
      name: 'highlights',
      title: 'Key Highlights',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              type: 'string',
              title: 'Highlight Title',
            },
            {
              name: 'description',
              type: 'text',
              title: 'Description',
            },
            {
              name: 'icon',
              type: 'string',
              title: 'Icon Name',
              description: 'Lucide icon name (e.g., "anchor", "wine", "mountain")',
            },
          ],
        },
      ],
      description: 'Key highlights and features of the event',
    }),
    defineField({
      name: 'itinerary',
      title: 'Itinerary',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'day',
              type: 'number',
              title: 'Day',
              validation: (Rule) => Rule.min(1),
            },
            {
              name: 'title',
              type: 'string',
              title: 'Day Title',
            },
            {
              name: 'activities',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    {
                      name: 'time',
                      type: 'string',
                      title: 'Time',
                    },
                    {
                      name: 'activity',
                      type: 'string',
                      title: 'Activity',
                    },
                    {
                      name: 'description',
                      type: 'text',
                      title: 'Description',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      description: 'Detailed itinerary for multi-day events',
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
      description: "List of what's included in the event",
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
      description: "List of what's not included in the event",
    }),
    defineField({
      name: 'requirements',
      title: 'Requirements',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              type: 'string',
              title: 'Requirement Title',
            },
            {
              name: 'description',
              type: 'text',
              title: 'Description',
            },
            {
              name: 'mandatory',
              type: 'boolean',
              title: 'Mandatory',
              initialValue: true,
            },
          ],
        },
      ],
      description: 'Requirements and prerequisites for the event',
    }),
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              type: 'string',
              title: 'Customer Name',
            },
            {
              name: 'rating',
              type: 'number',
              title: 'Rating',
              validation: (Rule) => Rule.min(1).max(5),
            },
            {
              name: 'text',
              type: 'text',
              title: 'Testimonial Text',
            },
            {
              name: 'date',
              type: 'date',
              title: 'Date',
            },
          ],
        },
      ],
      description: 'Customer testimonials and reviews',
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
          of: [{type: 'string'}],
          title: 'Keywords',
          description: 'Keywords for SEO',
        },
      ],
      description: 'SEO optimization fields',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'location',
      media: 'images.0',
    },
    prepare(selection) {
      const {title, subtitle, media} = selection
      return {
        title: title || 'Event',
        subtitle: subtitle || 'No location',
        media: media,
      }
    },
  },
})
