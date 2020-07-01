import React from 'react'

import { Typography } from '@material-ui/core'

import DocsLayout from '../../components/Layout/Layouts/DocsLayout'
import Markdown from '../../components/Docs/Markdown'
import withAuth from '../../hocs/withAuth'

interface IDocsPageProps {
    //
}

const src =
'### TOC\n1. [Introduction](#introduction)\n### Getting started\nUsing Spotlight is easy\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean imperdiet dapibus pretium. Sed nibh enim, vehicula laoreet sem et, fringilla mattis lectus. Mauris velit enim, sodales id dignissim sed, tempus et lectus. Ut nec scelerisque est. Curabitur varius lacinia tortor, at fringilla urna fringilla ut. Vestibulum in ligula tellus. Vivamus eget odio pharetra, condimentum sem semper, commodo ligula. Ut dapibus ac nunc id tempus. Duis sollicitudin a nulla eget vehicula.\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean imperdiet dapibus pretium. Sed nibh enim, vehicula laoreet sem et, fringilla mattis lectus. Mauris velit enim, sodales id dignissim sed, tempus et lectus. Ut nec scelerisque est. Curabitur varius lacinia tortor, at fringilla urna fringilla ut. Vestibulum in ligula tellus. Vivamus eget odio pharetra, condimentum sem semper, commodo ligula. Ut dapibus ac nunc id tempus. Duis sollicitudin a nulla eget vehicula.\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean imperdiet dapibus pretium. Sed nibh enim, vehicula laoreet sem et, fringilla mattis lectus. Mauris velit enim, sodales id dignissim sed, tempus et lectus. Ut nec scelerisque est. Curabitur varius lacinia tortor, at fringilla urna fringilla ut. Vestibulum in ligula tellus. Vivamus eget odio pharetra, condimentum sem semper, commodo ligula. Ut dapibus ac nunc id tempus. Duis sollicitudin a nulla eget vehicula.\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean imperdiet dapibus pretium. Sed nibh enim, vehicula laoreet sem et, fringilla mattis lectus. Mauris velit enim, sodales id dignissim sed, tempus et lectus. Ut nec scelerisque est. Curabitur varius lacinia tortor, at fringilla urna fringilla ut. Vestibulum in ligula tellus. Vivamus eget odio pharetra, condimentum sem semper, commodo ligula. Ut dapibus ac nunc id tempus. Duis sollicitudin a nulla eget vehicula.\n#### Introduction\n'
+ 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean imperdiet dapibus pretium. Sed nibh enim, vehicula laoreet sem et, fringilla mattis lectus. Mauris velit enim, sodales id dignissim sed, tempus et lectus. Ut nec scelerisque est. Curabitur varius lacinia tortor, at fringilla urna fringilla ut. Vestibulum in ligula tellus. Vivamus eget odio pharetra, condimentum sem semper, commodo ligula. Ut dapibus ac nunc id tempus. Duis sollicitudin a nulla eget vehicula.\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean imperdiet dapibus pretium. Sed nibh enim, vehicula laoreet sem et, fringilla mattis lectus. Mauris velit enim, sodales id dignissim sed, tempus et lectus. Ut nec scelerisque est. Curabitur varius lacinia tortor, at fringilla urna fringilla ut. Vestibulum in ligula tellus. Vivamus eget odio pharetra, condimentum sem semper, commodo ligula. Ut dapibus ac nunc id tempus. Duis sollicitudin a nulla eget vehicula.\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean imperdiet dapibus pretium. Sed nibh enim, vehicula laoreet sem et, fringilla mattis lectus. Mauris velit enim, sodales id dignissim sed, tempus et lectus. Ut nec scelerisque est. Curabitur varius lacinia tortor, at fringilla urna fringilla ut. Vestibulum in ligula tellus. Vivamus eget odio pharetra, condimentum sem semper, commodo ligula. Ut dapibus ac nunc id tempus. Duis sollicitudin a nulla eget vehicula.\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean imperdiet dapibus pretium. Sed nibh enim, vehicula laoreet sem et, fringilla mattis lectus. Mauris velit enim, sodales id dignissim sed, tempus et lectus. Ut nec scelerisque est. Curabitur varius lacinia tortor, at fringilla urna fringilla ut. Vestibulum in ligula tellus. Vivamus eget odio pharetra, condimentum sem semper, commodo ligula. Ut dapibus ac nunc id tempus. Duis sollicitudin a nulla eget vehicula.\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean imperdiet dapibus pretium. Sed nibh enim, vehicula laoreet sem et, fringilla mattis lectus. Mauris velit enim, sodales id dignissim sed, tempus et lectus. Ut nec scelerisque est. Curabitur varius lacinia tortor, at fringilla urna fringilla ut. Vestibulum in ligula tellus. Vivamus eget odio pharetra, condimentum sem semper, commodo ligula. Ut dapibus ac nunc id tempus. Duis sollicitudin a nulla eget vehicula.\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean imperdiet dapibus pretium. Sed nibh enim, vehicula laoreet sem et, fringilla mattis lectus. Mauris velit enim, sodales id dignissim sed, tempus et lectus. Ut nec scelerisque est. Curabitur varius lacinia tortor, at fringilla urna fringilla ut. Vestibulum in ligula tellus. Vivamus eget odio pharetra, condimentum sem semper, commodo ligula. Ut dapibus ac nunc id tempus. Duis sollicitudin a nulla eget vehicula.\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean imperdiet dapibus pretium. Sed nibh enim, vehicula laoreet sem et, fringilla mattis lectus. Mauris velit enim, sodales id dignissim sed, tempus et lectus. Ut nec scelerisque est. Curabitur varius lacinia tortor, at fringilla urna fringilla ut. Vestibulum in ligula tellus. Vivamus eget odio pharetra, condimentum sem semper, commodo ligula. Ut dapibus ac nunc id tempus. Duis sollicitudin a nulla eget vehicula.\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean imperdiet dapibus pretium. Sed nibh enim, vehicula laoreet sem et, fringilla mattis lectus. Mauris velit enim, sodales id dignissim sed, tempus et lectus. Ut nec scelerisque est. Curabitur varius lacinia tortor, at fringilla urna fringilla ut. Vestibulum in ligula tellus. Vivamus eget odio pharetra, condimentum sem semper, commodo ligula. Ut dapibus ac nunc id tempus. Duis sollicitudin a nulla eget vehicula.\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean imperdiet dapibus pretium. Sed nibh enim, vehicula laoreet sem et, fringilla mattis lectus. Mauris velit enim, sodales id dignissim sed, tempus et lectus. Ut nec scelerisque est. Curabitur varius lacinia tortor, at fringilla urna fringilla ut. Vestibulum in ligula tellus. Vivamus eget odio pharetra, condimentum sem semper, commodo ligula. Ut dapibus ac nunc id tempus. Duis sollicitudin a nulla eget vehicula.\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean imperdiet dapibus pretium. Sed nibh enim, vehicula laoreet sem et, fringilla mattis lectus. Mauris velit enim, sodales id dignissim sed, tempus et lectus. Ut nec scelerisque est. Curabitur varius lacinia tortor, at fringilla urna fringilla ut. Vestibulum in ligula tellus. Vivamus eget odio pharetra, condimentum sem semper, commodo ligula. Ut dapibus ac nunc id tempus. Duis sollicitudin a nulla eget vehicula.\n'

const DocsPage = (props: IDocsPageProps) => {
    return (
        <Markdown source={src} renderers={{ h1: Typography }} />
    )
}

DocsPage.getLayout = ({ children }) => <DocsLayout>{children}</DocsLayout>

export default withAuth()(DocsPage)
