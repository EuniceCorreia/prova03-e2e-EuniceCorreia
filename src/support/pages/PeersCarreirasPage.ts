import { Page } from '@playwright/test';
import PeersContatoPage from './PeersContatoPage';

export default class PeersCarreirasPage extends PeersContatoPage {
  constructor(readonly page: Page) {
    super(page);
  }

  async preencherContatoCarreiras(): Promise<void> {
    await this.acessarAba('Carreiras');
    await this.preencherFormularioCarreiras();
  }

  async validarContatoCarreirasPreenchido(): Promise<void> {
    await this.validarCamposCarreiras();
  }
}
