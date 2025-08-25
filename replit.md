# AI Current - Modern AI News Website

## Overview

AI Current is a modern static website focused on artificial intelligence news and industry updates. Built with Eleventy (11ty) as the static site generator, it features a clean, professional design with search functionality, dark mode support, and responsive layout. The site showcases AI industry news through markdown-based content management, with features like author profiles, categorized articles, and rich metadata support.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Static Site Generation
- **Framework**: Eleventy (11ty) v3.1.2 as the primary static site generator
- **Content Management**: Markdown-based articles with YAML frontmatter for metadata
- **Template Engine**: Nunjucks templates for layouts and includes
- **Build Target**: Generates static files to `/dist` directory for deployment

### Frontend Architecture
- **Styling Approach**: CSS custom properties (CSS variables) for consistent theming
- **Component Structure**: Modular partial templates in `src/_includes/partials/`
- **JavaScript**: Vanilla ES6+ with class-based architecture for app functionality
- **Search Implementation**: Client-side fuzzy search using Fuse.js library
- **Theme System**: CSS-based dark/light mode with localStorage persistence

### Content Structure
- **Articles**: Markdown files in `/content/` with rich frontmatter (title, slug, category, tags, author, etc.)
- **Metadata**: JSON-based configuration for authors, categories, and tags in `/content/meta/`
- **Asset Management**: Images and media stored in `/src/assets/` and `/static/` directories
- **URL Structure**: SEO-friendly URLs generated from article slugs

### Build and Deployment
- **Output**: All files build to `/dist` with relative paths for deployment flexibility
- **Optimization**: Configured for Netlify deployment with proper headers and redirects
- **Asset Handling**: Static files copied as-is, processed assets built through Eleventy pipeline

### Design System
- **Color Palette**: Navy (#1A365D), Electric Blue (#3182CE), Near-Black (#1A1A1A)
- **Typography**: Inter font family from Google Fonts with system font fallbacks
- **Component Library**: Reusable partials for navigation, hero sections, article cards, and footer
- **Responsive Design**: Mobile-first approach with hamburger navigation and adaptive layouts

## External Dependencies

### Core Framework
- **Eleventy (@11ty/eleventy)**: Static site generator and build system
- **Markdown-it**: Markdown processing and rendering engine

### Client-Side Libraries
- **Fuse.js**: Fuzzy search functionality for article search feature
- **Google Fonts**: Inter font family for typography

### Development Tools
- **Node.js**: Runtime environment for build processes
- **npm**: Package management and build script execution

### Deployment Platform
- **Netlify**: Primary deployment target with optimized build configuration
- **Static Hosting**: Designed for CDN-based static file serving

### Content Management
- **File-based CMS**: Markdown files with YAML frontmatter for content authoring
- **JSON Configuration**: Metadata management through structured JSON files
- **Git-based Workflow**: Version control integrated content management