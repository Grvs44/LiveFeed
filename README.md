# COMP3207 Coursework 2
## Running the Application Locally
### Backend
1. Enter the command:
```bash
cd Backend
```
2. Install all the required Python libraries by entering:
```bash
pip install -r requirements.txt
```
3. Start the Backend of the application:
```bash
func start
```
### Frontend
1. Enter the command:
```bash
cd Frontend
```
2. Install all the required npm packages:
```bash
npm i
```
3. Start the Frontend of the application:
```bash
npm run
```
## Sources
### Backend
- Livestream management adapted from https://cloud.google.com/livestream/docs/quickstarts/quickstart-hls
### Frontend
- Project template adapted from https://github.com/github/codespaces-react and https://github.com/Grvs44/budgetmanager
- `index.tsx`: React Router future flags adapted from https://stackoverflow.com/a/79228826/18309216
- `vite-end.d.ts` adapted from https://vitejs.dev/guide/env-and-mode.html
- `ListItemButtonLink` adapted from https://github.com/Grvs44/budgetmanager/blob/main/budgetmanagerpwa/src/components/ListItemButtonLink.tsx
- `MenuDrawer` adapted from https://github.com/Grvs44/budgetmanager/blob/main/budgetmanagerpwa/src/components/MenuDrawer.tsx
- `TopBar` adapted from https://github.com/Grvs44/budgetmanager/blob/main/budgetmanagerpwa/src/containers/TopBar.tsx
- `PubSubClientProvider`: code for `@azure/web-pubsub-client` library adapted from https://learn.microsoft.com/en-us/javascript/api/overview/azure/web-pubsub-client-readme?view=azure-node-latest
- `PubSubClientProvider`: unmount hook adapted from https://bobbyhadz.com/blog/react-hook-on-unmount
- `apiSlice` adapted from https://github.com/Grvs44/budgetmanager/blob/main/budgetmanagerpwa/src/redux/apiSlice.ts
- `apiSlice` `prepareHeaders` adapted from https://redux-toolkit.js.org/rtk-query/api/fetchBaseQuery#setting-default-headers-on-requests
- `titleSlice` adapted from https://github.com/Grvs44/budgetmanager/blob/main/budgetmanagerpwa/src/redux/titleSlice.ts
- `authConfig` adapted from https://learn.microsoft.com/en-us/azure/active-directory-b2c/enable-authentication-react-spa-app
