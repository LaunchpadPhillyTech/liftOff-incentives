// Octokit.js
// https://github.com/octokit/core.js#readme
const octokit = new Octokit({
    auth: ""
  })
  
const slide = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
    owner: 'LaunchpadPhillyTech',
    repo: 'liftoff-learning',
    path: 'nodejs-presentation/slides',
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })

console.log("SLIDES ", slides);
        
async function loadGitHubContent() {
    const loader = document.getElementById('loader');
    loader.style.display = 'block';

    try {
        // Example of fetching multiple markdown files
        const files = ['intro.md', 'main-content.md', 'conclusion.md'];
        const container = document.getElementById('presentation-container');
        
        
        
        for (const file of files) {
            const response = await fetch(
                `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${config.slidePath}/${file}`
            );
            console.log( "DEBUG::URL =>", `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${config.slidePath}/${file}`);
            
            
            if (!response.ok) throw new Error(`Failed to load ${file}`);
            
            const data = await response.json();
            const content = atob(data.content);
            
            // Create new section for each markdown file
            const section = document.createElement('section');
            section.setAttribute('data-markdown', '');
            section.setAttribute('data-separator', '^\n\n');
            
            const textarea = document.createElement('textarea');
            textarea.setAttribute('data-template', '');
            textarea.textContent = content;
            
            section.appendChild(textarea);
            container.appendChild(section);
        }

        // Initialize RevealJS after content is loaded
        Reveal.initialize({
            hash: true,
            markdown: {
                smartypants: true,
                breaks: true
            },
            plugins: [ RevealMarkdown, RevealHighlight, RevealNotes ]
        });

    } catch (error) {
        console.error('Error loading content:', error);
        container.innerHTML = `<section><h2>Error Loading Content</h2><p>${error.message}</p></section>`;
    } finally {
        loader.style.display = 'none';
    }
}

// Load content when page loads
document.addEventListener('DOMContentLoaded', loadGitHubContent);