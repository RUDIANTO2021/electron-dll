#region Assembly FastCodeSDK, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null
// D:\ElectronJS\CD FastCode\WindowsFormsApplication1\WindowsFormsApplication1\bin\Debug\FastCodeSDK.dll
#endregion

using System.Drawing;

namespace FastCodeSDK
{
    public class FPReader
    {
        public FPReader();

        public int TemplateCount { get; }
        public int ReaderCount { get; }

        public event FPIdentificationIDEventHandler FPIdentificationID;
        public event FPIdentificationStatusEventHandler FPIdentificationStatus;
        public event FPTemplateEventHandler FPTemplate;
        public event FPSamplesEventHandler FPSamples;
        public event FPReaderCurrentModeEventHandler FPReaderCurrentMode;
        public event FPReaderStatusEventHandler FPReaderStatus;
        public event FPImageReadyEventHandler FPImageReady;
        public event ErrorEventEventHandler ErrorEvent;
        public event FPReaderListEventHandler FPReaderList;
        public event FPEnrollmentStatusEventHandler FPEnrollmentStatus;

        //
        // Summary:
        //     Use this command to enroll a fingerprint. It is need at least 4 example of the
        //     fingerprint images from the same finger. If the scanned fingers is not from same
        //     finger, so it is need more than 4 scans. 4 fingerprint images, the SDK can choose
        //     the best example being used.
        //
        // Parameters:
        //   TemplateSafetyKey:
        //     is a string. It is use to validate the template. Please use a same string when
        //     enrollment and identification a same finger.
        public void FPEnrollmentFourSamplesStart(string TemplateSafetyKey = "");
        //
        // Summary:
        //     Using this command to cancel the FPEnrollmentFourSamples.
        public void FPEnrollmentFourSamplesStop();
        //
        // Summary:
        //     Use this command to enroll a fingerprint. It is only need one example of the
        //     fingerprint image. Because only one example, please make sure the fingerprint
        //     image captured perfectly. FPEnrollmentFourSamples command is more recommanded
        //     to enrollment a fingerprint.
        //
        // Parameters:
        //   TemplateSafetyKey:
        //     is a string. It is use to validate the template. Please use a same string when
        //     enrollment and identification a same finger.
        public void FPEnrollmentSingleSampleStart(string TemplateSafetyKey = "");
        //
        // Summary:
        //     Using this command to cancel the FPEnrollmentSingleSample.
        public void FPEnrollmentSingleSampleStop();
        //
        // Summary:
        //     Use this command to start identification process. Before start the identifation
        //     process, please select a reader using SelectReader command and upload template
        //     to the templates list using FPLoad command.
        //
        // Parameters:
        //   CandidatesCount:
        //     Limit the number of candidates is expected. At least 2 candidates. Default value
        //     is 5.
        public void FPIdentificationStart(int CandidatesCount = 5);
        //
        // Summary:
        //     Using this command to cancel the FPIdentification.
        public void FPIdentificationStop();
        //
        // Summary:
        //     Using this command to upload a template to Templates List.
        //
        // Parameters:
        //   ID:
        //     is the ID of the template. This ID will be used to inform the identity of the
        //     result of identification process.
        //
        //   FpIndex:
        //     is the number of finger. The value is a number between 0 to 10. Used, if the
        //     ID has several templates.
        //
        //   Template:
        //     is the template. Template is a digital fingerprint sample as the result of FPEnrollment
        //     process.
        //
        //   TemplateSafetyKey:
        //     is a string. It is use to validate the template. Please use a same string when
        //     enrollment and identification a same finger.
        public bool FPLoad(string ID, FingerIndex FpIndex, string Template, string TemplateSafetyKey = "");
        //
        // Summary:
        //     Using this command to check a template exists in Templates List or not.
        //
        // Parameters:
        //   ID:
        //     is the ID of the template.
        //
        //   FpIndex:
        //     is the number of finger. The value is a number between 0 to 10. Used, if the
        //     ID has several templates.
        public bool FPLoaded(string ID, FingerIndex FpIndex);
        //
        // Summary:
        //     Using this command to remove a template from Templates List.
        //
        // Parameters:
        //   ID:
        //     is the ID of the template will be removed.
        //
        //   FpIndex:
        //     is the number of finger. The value is a number between 0 to 10. Used, if the
        //     ID has several templates.
        public bool FPRemove(string ID, FingerIndex FpIndex);
        //
        // Summary:
        //     Using this command to remove all templates from Templates List.
        public void FPRemoveAll();
        //
        // Summary:
        //     Use this command to collect all readers attached on the computer. Please run
        //     this command before select a reader using SelectReader command.
        public void GetReaders();
        //
        // Summary:
        //     Use this command to select a reader. Although the computer attached more than
        //     one reader, but only one reader that can be used at a time. Before run this command
        //     please collect all the readers attached on the computer using GetReaders command.
        //
        // Parameters:
        //   Priority:
        //     Low or High. Use High value to allow the SDK to run in backgroud but need Administrator
        //     permission. Default value is Low.
        public void SelectReader(string VC, string SN, string AC, ReaderPriority Priority = ReaderPriority.Low);
        public string Version();

        public enum ReaderMode
        {
            None = 0,
            Enrollment1 = 1,
            Enrollment4 = 2,
            Identification = 3
        }
        public enum IdentificationStatus
        {
            OneCandidate = 0,
            MultiCandidates = 1,
            Ready = 2,
            AlredyStarted = 3,
            Fail = 4,
            ProcessStop = 5,
            NoCandidate = 6,
            EmptyTemplateList = 7
        }
        public enum ImageQualtiy
        {
            Good = 0,
            ReScan = 1
        }
        public enum FingerIndex
        {
            LeftPinkie = 0,
            LeftRing = 1,
            LeftMiddle = 2,
            LeftIndex = 3,
            LeftThumb = 4,
            RightThumb = 5,
            RightIndex = 6,
            RightMiddle = 7,
            RightRing = 8,
            RightPinkie = 9,
            None = 10
        }
        public enum ReaderStatus
        {
            FingerTouch = 0,
            NoReader = 1,
            ReaderSelected = 2,
            ReaderDisconnected = 3,
            InvalidActivationCode = 4,
            ModeNone = 5,
            PleaseRescan = 6
        }
        public enum EnrollmentStatus
        {
            Sucess = 0,
            Ready = 2,
            AlreadyStarted = 3,
            Fail = 4,
            ProcessStop = 5
        }
        public enum ReaderPriority
        {
            Low = 0,
            High = 1
        }

        public delegate void FPImageReadyEventHandler(Bitmap FPImage);
        public delegate void FPReaderCurrentModeEventHandler(ReaderMode Mode);
        public delegate void FPReaderListEventHandler(string VC);
        public delegate void FPReaderStatusEventHandler(ReaderStatus Status);
        public delegate void FPSamplesEventHandler(int SampleNumber);
        public delegate void FPTemplateEventHandler(string Template);
        public delegate void FPIdentificationIDEventHandler(string ID, FingerIndex FpIndex);
        public delegate void FPEnrollmentStatusEventHandler(EnrollmentStatus Status);
        public delegate void FPIdentificationStatusEventHandler(IdentificationStatus Status);
        public delegate void ErrorEventEventHandler(string ErrorMessage, int ErrorNumber);
    }
}