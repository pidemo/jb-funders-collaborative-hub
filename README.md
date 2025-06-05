# jb-fch

## Current Script Status

**Important:** At the moment, `add-collaboration.js` and `add-event.js` are the main scripts currently in use. The files `collaborations.js` and `events.js` are future iterations that haven't been implemented yet.

---

## Current Implementation (add-collaboration.js & add-event.js)

### add-collaboration.js Features

#### Form Requirements

- **Form ID**: `#submit-collaboration`
- **Event Handling**: Uses form submit event with `event.preventDefault()`

#### 1. Rich Text Editors (Quill)

- **Multiple Quill editors** for different fields:
  - `#editor-aims` → hidden field `#Aims`
  - `#editor-involved` → hidden field `#Who-Is-Involved`
  - `#editor-others` → hidden field `#How-Can-Others-Get-Involved`
  - `#editor-resources` → hidden field `#Learning-Or-Resources`

#### 2. Specialties/Activities Checkboxes

- Each checkbox needs `data-activity-wfid` attribute
- Hidden field with ID `activities-wfids` automatically updated with comma-separated values

#### 3. Dynamic Location Select

- Main select element: `#Location`
- Options populated from elements with:
  - `data-location-select` attribute (display name)
  - `data-location-value` attribute (option value)

#### 4. Character Counter

- **Field**: `#Collab-Summary` (100 character limit)
- **Counter display**: `#charcount`
- **Visual indicator**: `#charbox` with color-coded backgrounds:
  - Green: More than 5 characters remaining
  - Orange: 5 or fewer characters remaining
  - Red: Character limit exceeded

#### 5. Error Logging

- Automatic error reporting to webhook for debugging
- Tracks form submission errors and network issues

### add-event.js Features

#### Form Requirements

- **Form ID**: `#submit-event`
- **Event Handling**: Uses form submit event with `event.preventDefault()`

#### 1. Rich Text Editor (Quill)

- **Single editor**: `#editor` → hidden field `#Further-details`

#### 2. Location Type Toggle

- **Trigger**: `#Location-type` dropdown
- **Target**: `#physical-location` field
- Shows/hides physical location field based on "Online" vs other options

#### 3. Sign-up Type Dynamic Fields

- **Trigger**: `#signUpType` dropdown
- **Options**:
  - `"email"`: Shows `#emailField`, makes `#Email-to-register` required
  - `"online"`: Shows `#urlField`, makes `#Link-to-register` required
  - Other: Hides both fields

#### 4. Character Counter

- **Field**: `#Short-description` (100 character limit)
- **Counter display**: `#charcount`
- **Visual indicator**: `#charbox` with same color scheme as collaboration form

#### 5. Error Logging

- Same automatic error reporting system as collaboration form

---

## Future Implementation (collaborations.js & events.js)

### Key Improvements in Future Scripts

#### 1. Enhanced Event Handling

- **Button-based submission** instead of form submit events
- Uses `#submit-collaboration-button` with click event
- Better compatibility with Webflow forms (avoids backend submission)

#### 2. Accessibility Improvements

- **Keyboard navigation**: Enter/Space key support for custom buttons
- **ARIA attributes**: Proper labeling for screen readers
- **Tab index management**: Better keyboard accessibility

#### 3. Form Validation

- **Built-in validation checking** with `checkFormValidity()`
- **Browser validation messages** displayed before submission
- **Validation reporting** via `reportValidity()`

#### 4. Enhanced Notification System

- **Improved message handling** with `displayNotificationMessage()`
- **Better error states**: Hides submit button on error
- **Form reset on success**: Automatic form clearing
- **Wrapper-based messaging**: More robust message display

#### 5. Code Organization

- **Modular functions**: Better separation of concerns
- **Reusable components**: Accessibility and validation functions
- **Cleaner error handling**: More sophisticated error management

### Migration Notes

When switching to the future implementation:

1. **Change button type**: Use custom button instead of submit button
2. **Update selectors**: Submit button ID changes to `#submit-collaboration-button`
3. **Modify HTML**: Ensure proper form wrapper structure for notifications
4. **Test accessibility**: Verify keyboard navigation works correctly
5. **Update error handling**: New error reporting structure

---

## General Setup Instructions

### Required Elements for All Scripts

#### Success/Error Messages

- `.w-form-done` - Success message container
- `.w-form-fail` - Error message container

#### Form Structure

- Forms should be wrapped in `.w-form` container
- Hidden input fields must match the documented IDs
- Submit buttons must use the correct IDs for each script version

### Webhook Configuration

- **Collaboration forms**: Uses webhook ending in `0rwzyvqdypm21391f9vqhetvus9xjra8`
- **Event forms**: Uses webhook ending in `xy2rivaujzyfb5969p2yxhb9avghv9pt`
- **Error logging**: Uses webhook ending in `ym6jrhngcvg27kgz7h77yn95w1vt459l`

---

**If you update field names, IDs, or attributes in Webflow, make sure to update them in the corresponding script to keep everything in sync!**
