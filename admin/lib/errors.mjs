// Erreur HTTP partagée par les modules de l'admin (status → code HTTP).
export class HttpError extends Error {
  constructor(status, message, extra) {
    super(message);
    this.status = status;
    this.extra = extra;
  }
}
