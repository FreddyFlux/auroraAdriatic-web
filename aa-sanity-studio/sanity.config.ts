import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {documentInternationalization} from '@sanity/document-internationalization'
import {languageFilter} from '@sanity/language-filter'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'aurora-adriatic',

  projectId: '9az93sif',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Navigation')
              .child(
                S.documentTypeList('navigation')
                  .title('Navigation')
                  .filter('_type == "navigation"'),
              ),
            ...S.documentTypeListItems().filter(
              (listItem) => !['navigation'].includes(listItem.getId()!),
            ),
          ]),
    }),
    visionTool(),
    documentInternationalization({
      supportedLanguages: [
        {id: 'en', title: 'English'},
        {id: 'no', title: 'Norwegian'},
        {id: 'hr', title: 'Croatian'},
      ],
      schemaTypes: ['navigation'],
    }),
    languageFilter({
      supportedLanguages: [
        {id: 'en', title: 'English'},
        {id: 'no', title: 'Norwegian'},
        {id: 'hr', title: 'Croatian'},
      ],
      defaultLanguages: ['en'],
      documentTypes: ['navigation'],
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
