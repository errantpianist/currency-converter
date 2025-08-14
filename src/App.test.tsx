import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { Provider } from 'react-redux';
import { store } from '../src/store/store';
import '@testing-library/jest-dom';
import App from '../src/App';
import * as currencyAPI from '../src/features/currencyConverter/currencyAPI';

describe('Currency Converter', () => {
  beforeAll(() => {
    vi.spyOn(currencyAPI, 'fetchExchangeRates').mockImplementation(async (baseCurrency: string) => {
      if (baseCurrency === 'GBP') {
        return {
          USD: { code: 'USD', rate: 1.25 },
          EUR: { code: 'EUR', rate: 1.15 }
        } as Record<string, currencyAPI.RateData>;
      }
      if (baseCurrency === 'EUR') {
        return {
          USD: { code: 'USD', rate: 1.10 },
          GBP: { code: 'GBP', rate: 0.87 }
        } as Record<string, currencyAPI.RateData>;
      }
      return {} as Record<string, currencyAPI.RateData>;
    });
  });
  test('converts GBP to USD correctly', async () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    // Wait for initial rates to load
    expect(await screen.findByText(/Currency Converter/i)).toBeInTheDocument();

    // GBP to USD
    const baseDropdown = await screen.findByLabelText(/Base Currency/i) as HTMLSelectElement;
    fireEvent.change(baseDropdown, { target: { value: 'GBP' } });
    await waitFor(() => expect((baseDropdown as HTMLSelectElement).value).toBe('GBP'));

    const targetDropdown = await screen.findByLabelText(/Target Currency/i) as HTMLSelectElement;
    fireEvent.change(targetDropdown, { target: { value: 'USD' } });
    await waitFor(() => expect((targetDropdown as HTMLSelectElement).value).toBe('USD'));

    const amountInput = screen.getByRole('textbox', { name: /Amount to convert/i }) as HTMLInputElement;
    fireEvent.change(amountInput, { target: { value: '1' } });
    await waitFor(() => expect((amountInput as HTMLInputElement).value).toBe('1'));

    const convertButton = screen.getByRole('button', { name: /convert/i });
    fireEvent.click(convertButton);
  const gbpResult = await waitFor(() => screen.getByTestId('conversion-result'));
  expect(gbpResult).toBeInTheDocument();
  expect(gbpResult.textContent).toMatch(/1.25 USD/);
  });
});
