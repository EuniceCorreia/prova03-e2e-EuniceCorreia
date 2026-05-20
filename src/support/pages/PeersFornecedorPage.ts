import { Page } from '@playwright/test';
import PeersContatoPage from './PeersContatoPage';

export default class PeersFornecedorPage extends PeersContatoPage {
  constructor(readonly page: Page) {
    super(page);
  }

  async preencherContatoFornecedor(): Promise<void> {
    await this.acessarAba('Fornecedor');
    await this.preencherFormularioFornecedor();
  }

  async validarContatoFornecedorPreenchido(): Promise<void> {
    await this.validarCamposSolucoes('wpcf7-f3601-p2806-o3');
  }
}
