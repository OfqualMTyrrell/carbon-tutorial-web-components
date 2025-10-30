// === Repositories Page JavaScript ===
// Fetches GitHub repository data and populates a paginated data table

// Import components for repositories page
import '@carbon/web-components/es/components/data-table/index.js';
import '@carbon/web-components/es/components/link/index';
import '@carbon/web-components/es/components/pagination/index';
import { Octokit } from '@octokit/core';

// Initialize Octokit client for GitHub API
const octokitClient = new Octokit({});

// === Data Management ===
let data = []; // Repository data from GitHub API
let pageSize = 10; // Number of rows per page
let firstRowIndex = 0; // Index of first row on current page

// === Table Population ===
// Update table rows based on current page and page size
const updateTable = () => {
  const tableRowTemplate = document.querySelector('template#template--table-row');
  const tableBody = document.querySelector('cds-table-body');

  if (tableBody && tableRowTemplate) {
    tableBody.innerHTML = '';

    // Filter data for current page and populate rows
    data
      .filter((v, i) => i >= firstRowIndex && i < firstRowIndex + pageSize)
      .forEach((row) => {
        let newRow = tableRowTemplate.content.cloneNode(true);
        const keys = Object.keys(row);

        // Populate each cell based on key attribute
        keys.forEach((key) => {
          const keyEl = newRow.querySelector(`[key="${key}"]`);

          if (key === 'links') {
            // Special handling for links: Create GitHub and Homepage links
            keyEl.innerHTML = `<ul class="link-list">
  <li>
    <cds-link href="${row[key].url}">Github</cds-link>
  </li>
  <li>
    <cds-link href="${row[key].homepage}">Homepage</cds-link>
  </li>
</ul>`;
          } else {
            keyEl.innerHTML = row[key];
          }
        });

        tableBody.appendChild(newRow);
      });
  }
};

// === Skeleton Replacement ===
// Replace skeleton loader with actual table after data is fetched
const replaceSkeleton = () => {
  const tableSkeleton = document.querySelector('cds-table-skeleton');
  const tableTemplate = document.querySelector('template#template--table');

  if (tableSkeleton && tableTemplate) {
    tableSkeleton.replaceWith(tableTemplate.content.cloneNode(true));

    // Populate table with data
    updateTable();

    // Setup pagination
    updatePagination();
  }
};

// === API Data Fetching ===
// Fetch repository data from GitHub API
const fetchData = async () => {
  const res = await octokitClient.request('GET /orgs/{org}/repos', {
    org: 'carbon-design-system',
    per_page: 75,
    sort: 'updated',
    direction: 'desc',
  });

  if (res.status === 200) {
    // Transform API response to application data structure
    data = res.data.map((row) => ({
      name: row.name,
      created: new Date(row.created_at).toLocaleDateString(),
      updated: new Date(row.updated_at).toLocaleDateString(),
      openIssues: row.open_issues_count,
      stars: row.stargazers_count,
      links: { url: row.html_url, homepage: row.homepage },
      expansion: row.description,
    }));

    // Replace skeleton with populated table
    replaceSkeleton();
  } else {
    console.log('Error obtaining repository data');
  }
};

// Start data fetch on page load
fetchData();

// === Pagination Event Handlers ===
// Handle page changes (next/previous page)
const handlePageChangeCurrent = ({ detail }) => {
  firstRowIndex = (detail.page - 1) * detail.pageSize;
  updateTable();
};

// Handle page size changes (10, 20, 30, etc.)
const handlePageSizeChange = ({ detail }) => {
  pageSize = detail.pageSize;
  updateTable();
};

// === Pagination Setup ===
// Configure pagination component and attach event listeners
const updatePagination = () => {
  const paginationEl = document.querySelector('cds-pagination');
  paginationEl.setAttribute('total-items', data.length);

  // Defer event listener attachment until DOM is updated
  setTimeout(() => {
    paginationEl.addEventListener('cds-pagination-changed-current', handlePageChangeCurrent);
    paginationEl.addEventListener('cds-page-sizes-select-changed', handlePageSizeChange);
  }, 10);
};
