
using System.Data;
using System.Collections;
using SixLabors.ImageSharp.Web.Resolvers;
using Microsoft.Extensions.FileProviders;
using SixLabors.ImageSharp.Metadata;
using SixLabors.ImageSharp.Web.Providers;
using SixLabors.ImageSharp.Web;

namespace TodoApi2
{
    public class MinmaxRepository : IMinmaxRepository
    {
        MsSQLDBUtility oDS = new MsSQLDBUtility(AccessToDb.ConnectionString_Medirep);
       // MsSQLDBUtility nDS = new MsSQLDBUtility(AccessToDb.ConnectionString_CYERP);
        

        // MsSQLDBUtility oDS = new MsSQLDBUtility(ConfigurationManager.ConnectionStrings["Medirep"].ToString());

        // public CheckProject myType = new CheckProject();

        public ResultDTO GetData(Login c)
        {
            ResultDTO result = new ResultDTO();
            ArrayList alParameters = new ArrayList();


            //alParameters.Add(new object[3] { "@ProjectName", SqlDbType.NVarChar, c.ProjectName });
            DataSet ds = oDS.ExecProcedureDataSet(SPName.prc_sp_query_CheckItem, alParameters);

            result.dsResult = ds;
            result.dtResult = ds.Tables[0];
            result.TotalRecord = ds.Tables[0].Rows.Count;


            return result;
        }

        public ResultDTO GetGaugeData(Login c)
        {
            ResultDTO result = new ResultDTO();
            ArrayList alParameters = new ArrayList();


            alParameters.Add(new object[3] { "@barcode", SqlDbType.NVarChar, c.BarCodeStr });
            DataSet ds = oDS.ExecProcedureDataSet(SPName.prc_sp_query_gauge_data, alParameters);

            result.dsResult = ds;
            result.dtResult = ds.Tables[0];

            result.TotalRecord = ds.Tables[0].Rows.Count;


            return result;
        }

        public ResultDTO GetFullData(Login c)
        {
            ResultDTO result = new ResultDTO();
            ArrayList alParameters = new ArrayList();


            alParameters.Add(new object[3] { "@barcode", SqlDbType.NVarChar, c.BarCodeStr });
            DataSet ds = oDS.ExecProcedureDataSet(SPName.prc_sp_query_full_data, alParameters);

            result.dsResult = ds;
            result.dtResult = ds.Tables[0];

            result.TotalRecord = ds.Tables[0].Rows.Count;


            return result;
        }
        public ResultDTO GetLabData(Login c)
        {
            ResultDTO result = new ResultDTO();
            ArrayList alParameters = new ArrayList();


            alParameters.Add(new object[3] { "@barcode", SqlDbType.NVarChar, c.BarCodeStr });
            DataSet ds = oDS.ExecProcedureDataSet(SPName.prc_sp_query_lab_data, alParameters);

            result.dsResult = ds;
            result.dtResult = ds.Tables[0];

            result.TotalRecord = ds.Tables[0].Rows.Count;


            return result;
        }
        public ResultDTO GetBarcode(Login c)
        {
            ResultDTO result = new ResultDTO();
            ArrayList alParameters = new ArrayList();


            alParameters.Add(new object[3] { "@qc_id", SqlDbType.NVarChar, c?.qc_id });
            DataSet ds = oDS.ExecProcedureDataSet(SPName.prc_sp_query_customeByID, alParameters);

            result.dsResult = ds;
            result.dtResult = ds.Tables[0];

            result.TotalRecord = ds.Tables[0].Rows.Count;


            return result;
        }
        public ResultDTO GetIDList(Login c)
        {
            ResultDTO result = new ResultDTO();
            ArrayList alParameters = new ArrayList();


            alParameters.Add(new object[3] { "@PersonalId", SqlDbType.NVarChar, c?.PersonalId });
            DataSet ds = oDS.ExecProcedureDataSet(SPName.prc_sp_query_custome_Admin, alParameters);

            result.dsResult = ds;
            result.dtResult = ds.Tables[0];

            result.TotalRecord = ds.Tables[0].Rows.Count;


            return result;
        }

        public ResultDTO GetCheckDateList(Login c)
        {
                        ResultDTO result = new ResultDTO();
            ArrayList alParameters = new ArrayList();


            alParameters.Add(new object[3] { "@checkdate", SqlDbType.NVarChar, c?.CheckDate });
            DataSet ds = oDS.ExecProcedureDataSet(SPName.prc_sp_query_select_date, alParameters);

            result.dsResult = ds;
            result.dtResult = ds.Tables[0];

            result.TotalRecord = ds.Tables[0].Rows.Count;


            return result;

        }

       
    }


}

public class CustomPhysicalFileSystemProviderOptions
{
    public string RequestPath { get; set; }
    public string ContentPath { get; set; }
}

public class CustomPhysicalFileSystemProvider : IImageProvider
{
    /// <summary>
    /// The file provider abstraction.
    /// </summary>
    private readonly IFileProvider _fileProvider;

    /// <summary>
    /// Contains various format helper methods based on the current configuration.
    /// </summary>
    private readonly FormatUtilities _formatUtilities;

    /// <summary>
    /// Request base request path.
    /// </summary>
    private readonly PathString _requestPath;

    /// <summary>
    /// A match function used by the resolver to identify itself as the correct resolver to use.
    /// </summary>
    private Func<HttpContext, bool> _match;

    /// <summary>
    /// Initializes a new instance of the <see cref="PhysicalFileSystemProvider"/> class.
    /// </summary>
    /// <param name="environment">The environment used by this middleware.</param>
    /// <param name="formatUtilities">Contains various format helper methods based on the current configuration.</param>
    public CustomPhysicalFileSystemProvider(Microsoft.AspNetCore.Hosting.IHostingEnvironment environment, FormatUtilities formatUtilities, Microsoft.Extensions.Options.IOptions<CustomPhysicalFileSystemProviderOptions> mediaOptions)
    {
        this._fileProvider = string.IsNullOrEmpty(mediaOptions.Value.ContentPath) ? environment.WebRootFileProvider : new PhysicalFileProvider(mediaOptions.Value.ContentPath);
        this._formatUtilities = formatUtilities;

        this._requestPath = mediaOptions.Value.RequestPath;
    }

    /// <inheritdoc/>
    public ProcessingBehavior ProcessingBehavior { get; } = ProcessingBehavior.CommandOnly;

    /// <inheritdoc/>
    public Func<HttpContext, bool> Match
    {
        get { return string.IsNullOrEmpty(_requestPath) ? _ => true : _match ?? IsMatch; }

        set => _match = value;
    }

    /// <inheritdoc/>
    public bool IsValidRequest(HttpContext context) => this._formatUtilities.GetExtensionFromUri(context.Request.Path.Value) != null;

    /// <inheritdoc/>
    public Task<IImageResolver> GetAsync(HttpContext context)
    {
        // Remove assets request path if it's set.
        string path = string.IsNullOrEmpty(_requestPath) ? context.Request.Path.Value : context.Request.Path.Value.Substring(_requestPath.Value.Length);

        // Path has already been correctly parsed before here.
        IFileInfo fileInfo = this._fileProvider.GetFileInfo(path);

        // Check to see if the file exists.
        if (!fileInfo.Exists)
        {
            return Task.FromResult<IImageResolver>(null);
        }

        var metadata = new SixLabors.ImageSharp.Web.ImageMetadata(fileInfo.LastModified.UtcDateTime, fileInfo.Length);
        return Task.FromResult<IImageResolver>(new PhysicalFileSystemResolver(fileInfo, metadata));
    }

    private bool IsMatch(HttpContext context)
    {
        // if (!context.Request.Path.StartsWithNormalizedSegments(_requestPath, StringComparison.OrdinalIgnoreCase))
        // {
        //     return false;
        // }

        return true;
    }
}


