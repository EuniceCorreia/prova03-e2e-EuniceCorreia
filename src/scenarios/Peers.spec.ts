import { test } from '@playwright/test';
import { join } from 'path';
import { TheConfig } from 'sicolo';
import PeersCarreirasPage from '../support/pages/PeersCarreirasPage';
import PeersFornecedorPage from '../support/pages/PeersFornecedorPage';
import PeersOutrosPage from '../support/pages/PeersOutrosPage';

test.describe('Testes funcionais na pagina de contato da Peers', () => {
  const CONFIG = join(__dirname, '../support/fixtures/config.yml');
  const BASE_URL = TheConfig.fromFile(CONFIG)
    .andPath('application.peers')
    .retrieveData();
  const FALE_CONOSCO_URL = `${BASE_URL}fale-conosco/`;

  test.beforeEach(async ({ page }) => {
    const peersContatoPage = new PeersCarreirasPage(page);

    await page.goto(FALE_CONOSCO_URL);
    await peersContatoPage.aceitarCookies();
  });

  test('Preencher contato de carreiras', async ({ page }) => {
    const peersCarreirasPage = new PeersCarreirasPage(page);

    await peersCarreirasPage.preencherContatoCarreiras();
    await peersCarreirasPage.validarContatoCarreirasPreenchido();
  });

  test('Preencher contato de fornecedor', async ({ page }) => {
    const peersFornecedorPage = new PeersFornecedorPage(page);

    await peersFornecedorPage.preencherContatoFornecedor();
    await peersFornecedorPage.validarContatoFornecedorPreenchido();
  });

  test('Preencher contato de outros', async ({ page }) => {
    const peersOutrosPage = new PeersOutrosPage(page);

    await peersOutrosPage.preencherContatoOutros();
    await peersOutrosPage.validarContatoOutrosPreenchido();
  });
});
