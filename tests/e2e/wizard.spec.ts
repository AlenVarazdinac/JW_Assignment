import { test, expect } from '@playwright/test'

test('completes the wizard end-to-end and lists the submitted application', async ({ page }) => {
  await page.goto('/')
  // Nuxt renders the SSR HTML immediately, but client hydration
  // finishes a bit later. Wait for it so we don't click dead markup.
  await page.waitForLoadState('networkidle')

  // Step 1 - Country Selection
  await page.getByRole('button', { name: 'Citizenship' }).click()
  await page.getByPlaceholder('Search country...').fill('Croatia')
  await page.getByText('Croatia', { exact: true }).click()

  await page.getByRole('button', { name: 'Destination' }).click()
  await page.getByPlaceholder('Search country...').fill('Spain')
  await page.getByText('Spain', { exact: true }).click()

  await expect(page.getByText('Route Validated')).toBeVisible()
  await expect(page.getByTestId('route-summary')).toContainText('Croatia')
  await expect(page.getByTestId('route-summary')).toContainText('Spain')
  await page.getByRole('button', { name: 'Continue' }).click()

  // Step 2 - Personal Details
  await expect(page.getByRole('heading', { name: 'Personal Details' })).toBeVisible()

  await page.getByLabel('Full Name').fill('John Doe')
  await page.getByLabel('Email Address').fill('john.doe@example.com')

  // Phone country code defaults to citizenship (Croatia -> +385)
  await expect(page.getByText('+385')).toBeVisible()
  await page.getByLabel('Phone Number').fill('912345678')
  await page.getByLabel('Date of Birth').fill('15031990')
  await page.getByLabel('Passport Number').fill('AB1234567')

  await page.getByRole('button', { name: 'Continue' }).click()

  // Step 3 - Review & Confirm
  await expect(page.getByRole('heading', { name: 'Review & Confirm' })).toBeVisible()
  await expect(page.getByText('John Doe')).toBeVisible()
  await expect(page.getByText('+385 912345678')).toBeVisible()
  await expect(page.getByText('AB1234567')).toBeVisible()
  await expect(page.getByText('Croatia', { exact: true })).toBeVisible()
  await expect(page.getByText('Spain', { exact: true })).toBeVisible()

  await page.getByRole('button', { name: 'Submit Application' }).click()

  // Wizard resets to Step 1
  await expect(page.getByRole('heading', { name: 'Select your journey' })).toBeVisible()

  // Applications list shows the new submission
  await expect(page.getByText('1 Record')).toBeVisible()
  await expect(page.getByText('John Doe')).toBeVisible()
  await expect(page.getByText('Croatia')).toBeVisible()
  await expect(page.getByText('Spain')).toBeVisible()
})
