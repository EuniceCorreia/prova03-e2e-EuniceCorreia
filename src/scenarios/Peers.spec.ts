import { test } from '@playwright/test';
import { join } from 'path';
import { TheConfig } from 'sicolo';
import PeersPage from '../support/pages/PeersPage';

test.describe('Testes funcionais no site da Peers', () => {
  const CONFIG = join(__dirname, '../support/fixtures/config.yml');
  let peersPage: PeersPage;
  const BASE_URL = TheConfig.fromFile(CONFIG)
    .andPath('application.peers')
    .retrieveData();

  test.beforeEach(async ({ page }) => {
    peersPage = new PeersPage(page);
    await page.goto(BASE_URL);
  });

  test('Validar pagina inicial e navegar para quem somos', async () => {
    await peersPage.validarPaginaInicial();
    await peersPage.acessarQuemSomos();
    await peersPage.validarPaginaQuemSomos();
  });

  test('Preencher formulario de contato', async () => {
    await peersPage.validarPaginaInicial();
    await peersPage.preencherFormularioContato();
    await peersPage.validarFormularioPreenchido();
  });
});
