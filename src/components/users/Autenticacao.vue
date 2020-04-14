<template>
  <v-row class="ma-8">
    <v-col cols="6">
      <v-card>
        <v-card-title class="indigo darken-4 subtitle-1 white--text" dark>
          Como proceder à autenticação?
        </v-card-title>
        <v-card-text>
          <p>
            Na plataforma CLAV é possível proceder à autenticação através das
            seguintes formas:
          </p>
          <ul>
            <li>
              Cartão de Cidadão.
            </li>
            <li>
              Chave Móvel Digital.
            </li>
            <li>
              Email pessoal institucional e respetiva senha de acesso.
            </li>
          </ul>
          <p>
            Para tal, basta escolher o método de autenticação pretendido,
            através do botão de login correspondente.
          </p>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="6">
      <v-card>
        <v-card-title class="indigo darken-4 subtitle-1 white--text" dark>
          Autenticação
        </v-card-title>
        <v-card-text>
          <p>
            De modo a aceder à plataforma CLAV, por favor escolha um dos
            seguintes métodos de autenticação.
          </p>
        </v-card-text>
        <v-card-actions>
          <v-row>
            <v-col cols="12" class="d-flex flex-row-reverse">
              <form
                action="https://preprod.autenticacao.gov.pt/fa/Default.aspx"
                method="POST"
              >
                <input
                  type="hidden"
                  name="SAMLRequest"
                  v-bind:value="createSAML()"
                />
                <v-btn color="primary" type="submit">Cartão de Cidadão</v-btn>
              </form>
            </v-col>

            <v-col cols="12" class="d-flex flex-row-reverse">
              <v-btn color="primary" disabled type="submit">
                Chave Móvel Digital
              </v-btn>
            </v-col>

            <v-col class="d-flex flex-row-reverse">
              <v-btn color="primary" type="submit" @click="loginEmail">
                Email pessoal institucional
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
      <v-card>
        <!--<v-card-actions>
      <v-flex>
        É a primeira vez que utiliza estes serviços?
      </v-flex>
      <v-flex class="text-xs-right">
        <v-btn color="primary" type="submit" @click="registarUtilizador">Registar</v-btn>
      </v-flex>
      </v-card-actions>-->
        <v-card-text>
          Esqueceu a sua password?
        </v-card-text>
        <v-card-actions>
          <v-flex class="d-flex flex-row-reverse">
            <v-btn color="primary" type="submit" @click="recuperarPw">
              Recuperar
            </v-btn>
          </v-flex>
        </v-card-actions>
      </v-card>
    </v-col>

    <v-col cols="6">
      <v-card>
        <v-card-title class="indigo darken-4 subtitle-1 white--text" dark>
          Registo de chaves API
        </v-card-title>
        <v-card-text>
          <p>É um fornecedor de serviços? Registe aqui a sua chave API</p>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" type="submit" @click="registarApi">
            Registar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col cols="6">
      <v-card>
        <v-card-title class="indigo darken-4 subtitle-1 white--text" dark>
          Renovação de chaves API
        </v-card-title>
        <v-card-text>
          <p>A sua chave API expirou? Peça aqui a renovação da sua chave API</p>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" type="submit" @click="renovarApi">
            Renovar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
const lhost = require("@/config/global").host;
const builder = require("xmlbuilder");
const { v4: uuidv4 } = require("uuid");
const SignedXml = require("xml-crypto").SignedXml;
const FileKeyInfo = require("xml-crypto").FileKeyInfo;

import SigningKey from "!raw-loader!./../../certificates/signing_key.pem";
import X509Certificate from "!raw-loader!./../../certificates/x509_certificate.cer";

export default {
  name: "autenticacao",
  methods: {
    registarUtilizador() {
      this.$router.push("/users/registo");
    },
    recuperarPw() {
      this.$router.push("/users/recuperacao");
    },
    loginEmail() {
      this.$router.push("/users/login");
    },
    //API
    registarApi() {
      this.$router.push("/gestao/api/registo");
    },
    renovarApi() {
      this.$router.push("/gestao/api/renovar");
    },
    buildSamlRequest() {
      var uuid = "_" + uuidv4();
      var xml = builder
        .begin({
          encoding: "utf-8"
        })
        .ele({
          AuthnRequest: {
            "@ID": uuid,
            "@Version": "2.0",
            "@IssueInstant": new Date().toISOString(),
            "@Destination":
              "https://preprod.autenticacao.gov.pt/fa/Default.aspx",
            "@ProtocolBinding":
              "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST",
            "@AssertionConsumerServiceURL": lhost + "/users/callback",
            "@ProviderName": "CLAV",
            "@xmlns": "urn:oasis:names:tc:SAML:2.0:protocol",
            "@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
            "@xmlns:xsd": "http://www.w3.org/2001/XMLSchema",
            "@Consent": "urn:oasis:names:tc:SAML:2.0:consent:unspecified"
          }
        })
        .ele(
          "Issuer",
          {
            xmlns: "urn:oasis:names:tc:SAML:2.0:assertion"
          },
          "http://clav-auth.di.uminho.pt"
        )
        .up()
        .ele("Extensions")
        .ele("fa:RequestedAttributes", {
          "xmlns:fa": "http://autenticacao.cartaodecidadao.pt/atributos"
        })
        .ele("fa:RequestedAttribute", {
          Name: "http://interop.gov.pt/MDC/Cidadao/NIC",
          NameFormat: "urn:oasis:names:tc:SAML:2.0:attrname-format:uri",
          isRequired: "True"
        })
        .up()
        .ele("fa:RequestedAttribute", {
          Name: "http://interop.gov.pt/MDC/Cidadao/NomeCompleto",
          NameFormat: "urn:oasis:names:tc:SAML:2.0:attrname-format:uri",
          isRequired: "True"
        })
        .end();

      this.$request("post", "/auth/adicionar", {
        id: uuid,
        url: window.location.protocol + "//" + window.location.host
      });

      var sig = new SignedXml();
      sig.signingKey = SigningKey;
      sig.keyInfoProvider = new FileKeyInfo();
      sig.addReference(
        "//*[local-name(.)='AuthnRequest']",
        [
          "http://www.w3.org/2000/09/xmldsig#enveloped-signature",
          "http://www.w3.org/2001/10/xml-exc-c14n#"
        ],
        "http://www.w3.org/2000/09/xmldsig#sha1"
      );
      sig.computeSignature(xml, {
        location: { reference: "//*[local-name(.)='Issuer']", action: "after" }
      });

      //Metodo auxiliar pra adicionar X509, visto o keyInfoProvider nao funcionar em Typescript
      return sig.getSignedXml().replace("<X509Data/>", this.generateX509());
    },
    generateX509() {
      return (
        "<X509Data><X509Certificate>" +
        this.stripPEMHeaders(X509Certificate) +
        "</X509Certificate></X509Data>"
      );
    },
    stripPEMHeaders(pem) {
      const re = /-----BEGIN [0-9A-Z ]+-----([^-]*)-----END [0-9A-Z ]+-----/g;
      const pemData = re.exec(pem);
      if (pemData) {
        return pemData[1].replace(/[\r\n|\n]/g, "");
      } else {
        const stripped = pem.replace(/[\r\n|\n]/g, "");
        const base64DecodedAndBack = Buffer.from(stripped, "base64").toString(
          "base64"
        );
        if (stripped == base64DecodedAndBack) {
          return stripped;
        } else {
          throw new Error("provided certificate or key is not PEM-encoded");
        }
      }
    },
    stripExtension(xml) {
      return xml.replace(
        'Extensions xmlns="urn:oasis:names:tc:SAML:2.0:protocol"',
        "Extensions"
      );
    },
    createSAML() {
      return btoa(this.stripExtension(this.buildSamlRequest()));
    }
  }
};
</script>
