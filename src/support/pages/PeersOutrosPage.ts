import { Page } from '@playwright/test';
import PeersContatoPage from './PeersContatoPage';

export default class PeersOutrosPage extends PeersContatoPage {
  constructor(readonly page: Page) {
    super(page);
  }

  async preencherContatoOutros(): Promise<void> {
    await this.acessarAba('Outros');
    await this.preencherFormularioOutros();
  }

  async validarContatoOutrosPreenchido(): Promise<void> {
    await this.validarCamposSolucoes('wpcf7-f3601-p2806-o4');
  }
}
