# Power Automate Integration Reference

This directory contains reference artifacts for automating invoice ingestion using Microsoft Power Automate.

## Overview

The included `power_automate_definition.json` is an exported Power Automate flow definition from a production environment. This flow is designed to:
1. Monitor a designated shared mailbox for incoming emails with invoice attachments.
2. Extract the PDF attachments.
3. Send the attachments to the OCR pipeline (`services/ocr-pipeline`) for processing.
4. Route the extracted data and results to downstream systems.

## Important Note: Reference Architecture

**This is a reference architecture, not a plug-and-play solution.** 

To protect sensitive information, all tenant-specific and user-specific identifiers have been redacted (zeroed out) in the provided JSON definition. Before importing and using this flow in your own environment, you **must** replace these placeholder GUIDs with your actual environment IDs:

- **Tenant ID:** Replace `00000000-0000-0000-0000-000000000000` with your Azure AD Tenant ID.
- **User ID:** Replace `00000000-0000-0000-0000-000000000001` with the appropriate User ID for the connection.
- **Flow ID:** Replace `00000000-0000-0000-0000-000000000002` with a new Flow ID or allow Power Automate to generate one upon import.

## Directory Structure

- `power_automate_definition.json`: The core flow definition.
- `docs/`: Contains mock Power Automate call documentation, which helps illustrate the expected inputs and outputs when the flow interacts with the OCR pipeline.

## How to Use

1. Review the flow definition and the mock call documentation in the `docs/` folder to understand the expected data structures.
2. Import the JSON definition into your Power Automate environment.
3. Reconfigure the connections (e.g., Office 365 Outlook, HTTP connectors) to use your organization's credentials.
4. Update the endpoint URLs in the HTTP actions to point to your deployed instance of the OCR pipeline.
