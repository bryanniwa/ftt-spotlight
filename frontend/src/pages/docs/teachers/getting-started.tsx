import React from 'react'

import markdown from '../../../docs/teachers/getting-started.md'
import { prepareMarkdown } from '../../../utils/docs'

import MarkdownDocs, { getMarkdownDocsLayout } from '../../../components/Docs/MarkdownDocs'
import withAuth from '../../../hocs/withAuth'

const Page = ({ renderedMarkdown, tableOfContents }) => {
    return <MarkdownDocs renderedMarkdown={renderedMarkdown} tableOfContents={tableOfContents} />
}

Page.getInitialProps = () => {
    return prepareMarkdown(markdown)
}

Page.getLayout = getMarkdownDocsLayout

export default withAuth('teacher', 'staff', 'sysadmin')(Page)
